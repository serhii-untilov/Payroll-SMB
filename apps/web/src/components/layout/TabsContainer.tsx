import { SyntheticEvent, useState } from 'react';
import { Tabs } from './Tabs';
import { Tab } from './Tab';
import { TabPanel } from './TabPanel';

export interface TabComponent {
    label: string | (() => string);
    disabled?: boolean | (() => boolean);
    tab?: React.ReactNode | null;
}

export interface TabsContainerProps {
    name: string;
    tabs: TabComponent[];
    tabIndex?: string | null;
}

const PREFIX = 'tab-index-';

export function TabsContainer(props: TabsContainerProps) {
    const { name, tabs } = props;
    const [tabIndex, setTab] = useState<number>(
        Number(props.tabIndex ?? localStorage.getItem(PREFIX + name)),
    );

    const handleChangeTab = (_event: SyntheticEvent, tabIndex: number) => {
        setTab(tabIndex);
        localStorage.setItem(PREFIX + name, tabIndex.toString());
    };

    const getLabel = (label: string | (() => string)) =>
        typeof label === 'function' ? label() : label;
    const isDisabled = (disabled: boolean | (() => boolean)) =>
        typeof disabled === 'function' ? disabled() : !!disabled;

    return (
        <>
            <Tabs value={tabIndex} onChange={handleChangeTab}>
                {tabs.map((tab, index) => {
                    return (
                        <Tab
                            key={index}
                            label={getLabel(tab.label)}
                            disabled={isDisabled(tab.disabled ?? false)}
                        />
                    );
                })}
            </Tabs>
            {tabs.map((tab, index) => {
                return (
                    <TabPanel key={index} value={tabIndex} index={index}>
                        {tab.tab}
                    </TabPanel>
                );
            })}
        </>
    );
}
