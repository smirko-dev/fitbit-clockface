
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
                label={`${title}`}
                settingsKey="activity"
                options={[
                    { name: `${steps}`, value: 'steps' },
                    { name: `${dist}`, value: 'distance' },
                    { name: `${floors}`, value: 'floors' },
                    { name: `${cal}`, value: 'calories' }
                ]}
                onSelection={(value) => console.log(value)}
            />
            <ColorSelect
                settingsKey="color"
                colors={[
                    {color: '#2490DD'},
                    {color: '#eb4034'},
                    {color: '#d9cf1a'},
                    {color: '#2ab0ae'},
                    {color: '#ed1abc'},
                    {color: 'silver'}
                ]}
                onSelection={(color) => console.log(color)}
            />
        </Section>
    </Page>
  )
}

registerSettingsPage(settingsFunc);
