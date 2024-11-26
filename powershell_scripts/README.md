# PowerShell Helper

## Prerequisites

Before getting started, make sure you have the following copied to your USB device:
  - portable PowerShell 7 for Windows in folder PowerShell-Windows
  - powershell_scripts in folder powershell_scripts
  - for outputs 2 empty folders per device:
    - output/customerId/deviceId/hardware
    - output/customerId/deviceId/software

## Usage

- start PowerShell 7 in Windows Terminal or Windows PowerShell Console
    ```powershell
    E:\PowerShell-Windows\pwsh.exe
    ```
- execute scripts
    ```powershell
    E:\powershell_scripts\device_info.ps1 -OutputBasePath E:\output\customerId\deviceId\hardware\
    E:\powershell_scripts\software_info.ps1 -OutputBasePath E:\output\customerId\deviceId\software\
    ```
