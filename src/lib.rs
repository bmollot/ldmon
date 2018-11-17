extern crate stdweb;
#[macro_use]
extern crate yew;

mod components;

use yew::prelude::*;
use components::root::Root;

use stdweb::js_export;

#[js_export]
pub fn start() {
  yew::initialize();
  App::<Root>::new().mount_to_body();
  yew::run_loop();
}