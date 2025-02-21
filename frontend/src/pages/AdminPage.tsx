import {
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

export const AdminPage = () => {
  return (
    <BaseLayout>
      <VStack spacing={4} align="stretch" my={4}>
        <BaseBox width={'40em'}>
          <Text textAlign={'center'} fontSize={'2em'}>
            Admin Dashboard
          </Text>
        </BaseBox>

        <BaseBox width={'40em'}>
          <Tabs>
            <TabList my={2}>
              <Tab>User List</Tab>
              <Tab>Manage Characters</Tab>
            </TabList>

            <TabPanels>
              <TabPanel>
                <ManageUser />
              </TabPanel>
              <TabPanel>
                <ManageCharacter />
              </TabPanel>
            </TabPanels>
          </Tabs>
        </BaseBox>
      </VStack>
    </BaseLayout>
  );
};
