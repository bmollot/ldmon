extern crate stdweb;
#[macro_use]
extern crate yew;

mod components;

use yew::prelude::*;
use components::root::Root;

use stdweb::js_export;
use stdweb::web::{document, Element, INode, IParentNode};
use yew::html::{Scope, Component, Renderable};

#[js_export]
pub fn start() {
  let mainEl = document()
    .query_selector("main")
    .expect("can't get main node for rendering")
    .expect("can't unwrap main node");
  yew::initialize();
  App::<Root>::new().mount(mainEl);
  yew::run_loop();
}