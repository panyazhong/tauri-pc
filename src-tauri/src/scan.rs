use std::process::Command;
#[tauri::command]
pub fn execute_command(command: String) -> Result<String, String> {
    println!("{}", command);
    let output = Command::new("adb")
        .arg("shell")
        .arg(&command)
        .output()
        .map_err(|e| format!("Failed to execute command: {}", e))?;
    let stdout = String::from_utf8(output.stdout).map_err(|e: std::string::FromUtf8Error| {
        format!("Invalid UTF-8 sequence in output: {}", e)
    })?;

    let stderr = String::from_utf8(output.stderr).map_err(|e: std::string::FromUtf8Error| {
        format!("Invalid UTF-8 sequence in output: {}", e)
    })?;
    let result_str = stdout + "&" + &stderr;
    println!("{}", result_str);
    println!("{}", stderr);
    Ok(result_str)
}
