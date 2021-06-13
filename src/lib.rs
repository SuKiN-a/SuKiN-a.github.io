use druid::widget::{prelude::*, Align, Axis, Flex, Label, Tabs, TabsTransition};
use druid::{AppLauncher, Color, Data, Lens, WidgetExt, WindowDesc};
use wasm_bindgen::prelude::*;

#[wasm_bindgen]
pub fn start() {
    let main_window = WindowDesc::new(AppState::build_root_widget)
        .title("Hello World")
        .window_size((800.0, 600.0));
    AppLauncher::with_window(main_window)
        .launch(AppState::new())
        .expect("should not happen");
}

#[derive(Clone, Data, Lens)]
struct AppState {}

impl AppState {
    fn build_root_widget() -> impl Widget<AppState> {
        Tabs::new()
            .with_tab("About Me", AppState::about_page())
            .with_tab("Contact", AppState::contact_page())
            .with_transition(TabsTransition::Instant)
            .with_axis(Axis::Vertical)
            .background(Color::BLACK)
    }
    fn new() -> AppState {
        AppState {}
    }
    fn contact_page() -> impl Widget<AppState> {
        Label::new("You Can Contact Me On Discord, My Username is parzival#6471")
            .with_text_color(Color::FUCHSIA)
            .with_text_size(40.0)
            .center()
    }
    fn about_page() -> impl Widget<AppState> {
        Align::centered(
            Flex::column()
                .with_child(
                    Label::new(String::from("Hey there!"))
                        .with_text_color(Color::FUCHSIA)
                        .with_text_size(40.0),
                )
                .with_spacer(20.0)
                .with_child(
                    Label::new("I'm SuKin and this is my website!")
                        .with_text_color(Color::FUCHSIA)
                        .with_text_size(35.0),
                ),
        )
    }
}
