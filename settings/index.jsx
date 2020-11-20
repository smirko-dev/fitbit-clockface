
function settingsFunc(props){
import { gettext } from "i18n";

function settingsFunc(props) {
  let title = gettext("title");
  let steps = gettext("steps");
  let dist = gettext("dist");
  let floors = gettext("floors");
  let cal = gettext("cal");
  return (
    <Page>
        <Section>
            <Select 
                label={`User activity`}
                label={`${title}`}
                settingsKey="activity"
                options={[
                    { name: `${steps}`, value: "steps" },
                    { name: `${dist}`, value: "distance" },
                    { name: `${floors}`, value: "floors" },
                    { name: `${cal}`, value: "calories" }
                ]}
            />
        </Section>
    </Page>
  )
}

registerSettingsPage(settingsFunc);
