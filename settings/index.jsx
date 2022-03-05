
import { gettext } from "i18n";

function settingsFunc(props) {
  return (
    <Page>
        <Section>
            <Select 
                label={`${gettext("info")}`}
                settingsKey="info"
                options={[
                    { name: `${gettext("none")}`, value: 'none' },
                    { name: `${gettext("battery")}`, value: 'battery' },
                    { name: `${gettext("weather")}`, value: 'weather' }
                ]}
            />
            <Select 
                label={`${gettext("activity")}`}
                settingsKey="activity"
                options={[
                    { name: `${gettext("steps")}`, value: 'steps' },
                    { name: `${gettext("dist")}`, value: 'distance' },
                    { name: `${gettext("floors")}`, value: 'floors' },
                    { name: `${gettext("cal")}`, value: 'calories' }
                ]}
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
            />
        </Section>
    </Page>
  )
}

registerSettingsPage(settingsFunc);
