
function settingsFunc(props){
  return (
    <Page>
        <Section>
            <Select 
                label={`User activity`}
                settingsKey="activity"
                options={[
                    { name: "Steps", value: "steps" },
                    { name: "Distance", value: "distance" },
                    { name: "Stairs", value: "stairs" },
                    { name: "Calories", value: "calories" }
                ]}
            />
        </Section>
    </Page>
  )
}

registerSettingsPage(settingsFunc);
