# PowerShell Helper

## Prerequisites

Before getting started, make sure you have the following copied to your USB device:
  - (IGNORE this step for now) portable PowerShell 7 for Windows in folder PowerShell-Windows
  - powershell_scripts in folder powershell_scripts

## Usage

- (IGNORE this step for now) start PowerShell 7 in Windows Terminal or Windows PowerShell Console
    ```powershell
    E:\PowerShell-Windows\pwsh.exe
    ```

- start Windows PowerShell Console as Administrator. In the following command replace "E:\" with correct USB Drive and "MyCustomerId" with customer identifier. Execute command:
    ```powershell
    powershell.exe -NoProfile -ExecutionPolicy Bypass E:\powershell_scripts\collect_info.ps1 -CustomerId "MyCustomerId"
    ```
