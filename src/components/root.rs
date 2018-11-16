use yew::prelude::*;

use components::battle::Battle;

pub struct Root {
    link: ComponentLink<Root>,
}
pub enum Msg {}

impl Component for Root {
    type Message = Msg;
    type Properties = ();

    fn create(_: Self::Properties, link: ComponentLink<Self>) -> Self {
        Root {
            link,
        }
    }

    fn update(&mut self, _: Self::Message) -> ShouldRender {
        false
    }
}

impl Renderable<Root> for Root {
    fn view(&self) -> Html<Self> {
        html! {
            <div>
                <Battle:/>
            </div>
        }
    }
}
