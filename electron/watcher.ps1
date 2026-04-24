param(
    [Parameter(Mandatory = $true)][long]$Hwnd
)

$ErrorActionPreference = 'Stop'
$OutputEncoding = [Text.Encoding]::ASCII

Add-Type -TypeDefinition @"
using System;
using System.Runtime.InteropServices;

[ComImport]
[Guid("a5cd92ff-29be-454c-8d04-d82879fb3f1b")]
[InterfaceType(ComInterfaceType.InterfaceIsIUnknown)]
public interface IVirtualDesktopManager {
    [PreserveSig] int IsWindowOnCurrentVirtualDesktop(IntPtr hWnd, [MarshalAs(UnmanagedType.Bool)] out bool onCurrent);
}

public static class VDM {
    [ComImport]
    [Guid("aa509086-5ca9-4c25-8f95-589d3c07b48a")]
    public class VirtualDesktopManagerClass {}

    public static IVirtualDesktopManager Create() {
        return (IVirtualDesktopManager)(new VirtualDesktopManagerClass());
    }
}

public static class U {
    [DllImport("user32.dll")] public static extern short GetAsyncKeyState(int vKey);
    [DllImport("user32.dll")] public static extern bool GetCursorPos(out POINT lpPoint);
    [StructLayout(LayoutKind.Sequential)] public struct POINT { public int X; public int Y; }
}
"@ | Out-Null

$vdm = [VDM]::Create()
$hptr = [IntPtr]$Hwnd
$vdLast = $null
$vdTick = 0
$clickPrev = $false

while ($true) {
    # --- Left-click polling (~12 ms cadence) ---
    $down = ([U]::GetAsyncKeyState(0x01) -band 0x8000) -ne 0
    if ($down -and -not $clickPrev) {
        $pt = New-Object U+POINT
        [void][U]::GetCursorPos([ref]$pt)
        [Console]::Out.WriteLine("CLICK $($pt.X) $($pt.Y)")
        [Console]::Out.Flush()
    }
    $clickPrev = $down

    # --- Virtual-desktop polling (~1 s cadence) ---
    $vdTick++
    if ($vdTick -ge 40) {
        $vdTick = 0
        try {
            $onCurrent = $false
            $hr = $vdm.IsWindowOnCurrentVirtualDesktop($hptr, [ref]$onCurrent)
            if ($hr -eq 0) {
                $state = if ($onCurrent) { 'ON' } else { 'OFF' }
                if ($state -ne $vdLast) {
                    [Console]::Out.WriteLine($state)
                    [Console]::Out.Flush()
                    $vdLast = $state
                }
            }
        } catch { }
    }

    # 25 ms cadence: still catches clicks reliably, but gives the CPU enough
    # idle time to enter deep sleep states. Running at 12 ms overnight
    # prevented C-state entry and caused thermal buildup.
    Start-Sleep -Milliseconds 25
}
