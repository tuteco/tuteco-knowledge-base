# PowerShell Helper

## Prerequisites

Before getting started, make sure you have the following copied to your USB device:
  - portable PowerShell 7 for Windows in folder PowerShell-Windows
  - powershell_scripts in folder powershell_scripts

## Usage

- start PowerShell 7 in Windows Terminal or Windows PowerShell Console
    ```powershell
    E:\PowerShell-Windows\pwsh.exe
    ```
- execute command
    ```powershell
    Get-ComputerInfo | Select-Object CsName, CsDNSHostName
    ```

- create the following two folders per device for outputs. Use your customer identifier as customerId and `CsDNSHostName` or `CsName` from the previous step as deviceId:
    - output/customerId/deviceId/hardware
    - output/customerId/deviceId/software
 
- execute scripts
    ```powershell
    E:\powershell_scripts\device_info.ps1 -OutputBasePath E:\output\customerId\deviceId\hardware\
    E:\powershell_scripts\software_info.ps1 -OutputBasePath E:\output\customerId\deviceId\software\
    ```
