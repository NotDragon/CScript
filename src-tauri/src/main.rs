use tauri::{CustomMenuItem, Menu, MenuItem, Submenu, SystemTray, SystemTrayMenu, SystemTrayMenuItem, SystemTrayEvent, Manager, AboutMetadata, Wry, Builder, App, WindowUrl, WindowMenuEvent, WindowBuilder};
use std::{fs, path};

#[tauri::command]
fn save_code_to_file(code: String, dir: String, file: String) {
    if !path::Path::new(&dir).exists() {
        fs::create_dir(&dir).expect("TODO: panic message");
    }

    let full_dir = &format!("{}/{}", dir, file);

    if !path::Path::new(full_dir).exists() {
        fs::File::create(full_dir).expect("TODO: panic message");
    }

    fs::write(full_dir, code).expect("Failed to write in Sketch.ino");
}

fn main() {
    let tray_menu = SystemTrayMenu::new();
    let tray = SystemTray::new().with_menu(tray_menu);

    let file_menu = Submenu::new("File", Menu::new()
        .add_item(CustomMenuItem::new("new".to_string(), "New"))
        .add_item(CustomMenuItem::new("open".to_string(), "Open"))
        .add_submenu(Submenu::new("Open Recent", Menu::new()))
        .add_item(CustomMenuItem::new("save".to_string(), "Save"))
        .add_item(CustomMenuItem::new("save_as".to_string(), "Save As..."))
        .add_native_item(MenuItem::Separator)
        .add_item(CustomMenuItem::new("close".to_string(), "Close"))
        .add_item(CustomMenuItem::new("open_settings".to_string(), "Settings"))
        .add_native_item(MenuItem::Quit)
    );

    let edit_menu = Submenu::new("Edit", Menu::new()
        .add_native_item(MenuItem::Undo)
        .add_native_item(MenuItem::Redo)
        .add_native_item(MenuItem::Separator)
        .add_native_item(MenuItem::Zoom)
    );

    let sketch_menu = Submenu::new("Sketch", Menu::new()
        .add_item(CustomMenuItem::new("compile".to_string(), "Compile"))
        .add_item(CustomMenuItem::new("upload".to_string(), "Upload"))
        .add_item(CustomMenuItem::new("compile_binary".to_string(), "Compile To Binary"))
    );

    let tools_menu = Submenu::new("Tools", Menu::new()
        .add_item(CustomMenuItem::new("serial_monitor", "Serial Monitor"))
        .add_item(CustomMenuItem::new("serial_plotter", "Serial Plotter"))
        .add_native_item(MenuItem::Separator)
        .add_submenu(Submenu::new("Board", Menu::new()
            .add_item(CustomMenuItem::new("v1", "Tankbot"))
            .add_item(CustomMenuItem::new("v2", "Tankbot 2"))
        ))
    );

    let window_menu = Submenu::new("Window", Menu::new()
        .add_native_item(MenuItem::Hide)
        .add_native_item(MenuItem::HideOthers)
        .add_native_item(MenuItem::Separator)
        .add_native_item(MenuItem::Minimize)
        .add_native_item(MenuItem::EnterFullScreen)
        .add_native_item(MenuItem::ShowAll)
        .add_native_item(MenuItem::Separator)
        .add_native_item(MenuItem::CloseWindow)
    );

    let licence = fs::read_to_string("licence.txt").expect("Unable to read file");

    let help_menu = Submenu::new("Help", Menu::new()
        .add_native_item(MenuItem::About("CScript".to_string(), AboutMetadata::new()
            .version("0.0.0".to_string())
            .authors(vec!{ "Michalis Chatzittofi".to_string() })
            .comments("This software was created to program the Tankbot".to_string())
            .license(&*licence)
            .website("robo.com.cy".to_string())
            .website_label("Robo.com.cy".to_string())
        ))
    );

    let menu = Menu::new()
        .add_native_item(MenuItem::Copy)
        .add_submenu(file_menu)
        .add_submenu(edit_menu)
        .add_submenu(sketch_menu)
        .add_submenu(tools_menu)
        .add_submenu(window_menu)
        .add_submenu(help_menu);

    tauri::Builder::default()
        .menu(menu)
        .system_tray(tray)
        .on_menu_event(|event| {
            match event.menu_item_id() {
                "new" =>    {
                    println!("New");
                }
                "open" => {

                }
                "save" => {

                }
                "save_as" => {

                }
                "compile" => {
                    // event.window().eval("window.save_code()").expect("Failed to open settings menu");
                    event.window().eval("window.compile()").expect("Failed to compile");
                }
                "compile_binary" => {

                }
                "serial_monitor" => {

                }
                "serial_plotter" => {

                }
                "v1" => {

                }
                "v2" => {

                }
                "close" => {
                    event.window().close().unwrap();
                }
                "open_settings" => {
                    event.window().eval("window.open_settings_menu()").expect("Failed to open settings menu");
                }
                _ => {
                    println!("Event not handled: {}", event.menu_item_id());
                }
            }
        })
        .on_system_tray_event(|app, event| match event {
            SystemTrayEvent::LeftClick {
                position: _,
                size: _,
                ..
            } => {
                println!("system tray received a left click");
            }
            SystemTrayEvent::RightClick {
                position: _,
                size: _,
                ..
            } => {
                println!("system tray received a right click");
            }
            SystemTrayEvent::DoubleClick {
                position: _,
                size: _,
                ..
            } => {
                println!("system tray received a double click");
            }
            SystemTrayEvent::MenuItemClick { id, .. } => {
                match id.as_str() {
                    "quit" => {
                        std::process::exit(0);
                    }
                    "hide" => {
                        let window = app.get_window("main").unwrap();
                        window.hide().unwrap();
                    }
                    _ => {}
                }
            }
            _ => {}
        })
        .invoke_handler(tauri::generate_handler![save_code_to_file])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");


}