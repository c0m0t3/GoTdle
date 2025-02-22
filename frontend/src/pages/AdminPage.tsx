import {
  Box,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
  VStack,
} from '@chakra-ui/react';
import { BaseLayout } from '../layout/BaseLayout.tsx';
import { BaseBox } from '../components/BaseBox.tsx';
import { ManageCharacter } from './adminPageComponents/ManageCharacter.tsx';
import { ManageUser } from './adminPageComponents/ManageUser.tsx';
import { useState } from 'react';
import { CharacterCard } from './adminPageComponents/CharacterCard.tsx';

export const AdminPage = () => {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <BaseLayout>
      <Box width={'100%'} maxWidth={'none'}>
        <Tabs onChange={(index) => setActiveTab(index)}>
          <VStack spacing={4} my={4}>
            <BaseBox width={'40em'}>
              <Text textAlign={'center'} fontSize={'2em'}>
                Admin Dashboard
              </Text>
              <TabList mt={2}>
                <Tab>User List</Tab>
                <Tab>Manage Characters</Tab>
              </TabList>
            </BaseBox>

            <BaseBox width={'40em'}>
              <TabPanels>
                <TabPanel>
                  <ManageUser />
                </TabPanel>
                <TabPanel>
                  <ManageCharacter />
                </TabPanel>
              </TabPanels>
            </BaseBox>
            {activeTab === 1 && <CharacterCard />}
          </VStack>
        </Tabs>
      </Box>
    </BaseLayout>
  );
};
