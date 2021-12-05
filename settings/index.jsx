
import { gettext } from "i18n";

function settingsFunc(props) {
  return (
    <Page>
        <Section>
            <Select 
                label={`${gettext("title")}`}
                settingsKey="info"
                options={[
                    { name: `${gettext("steps")}`, value: 'steps' },
                    { name: `${gettext("dist")}`, value: 'distance' },
                    { name: `${gettext("floors")}`, value: 'floors' },
                    { name: `${gettext("cal")}`, value: 'calories' },
                    { name: `${gettext("weather")}`, value: 'weather' }
                ]}
                onSelection={(value) => console.log(`Selected info = ${value}`)}
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
                onSelection={(color) => console.log(`Selected color = ${color}`)}
            />
        </Section>
    </Page>
  )
}

registerSettingsPage(settingsFunc);
