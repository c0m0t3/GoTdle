import { Button, Menu, MenuButton, MenuItem, MenuList } from '@chakra-ui/react';
import { ChevronDownIcon } from '@chakra-ui/icons';
import { useNavigate } from 'react-router-dom';
import { CgProfile } from 'react-icons/cg';

export const ProfileMenu = () => {
  const navigate = useNavigate();

  const handleLogoutClick = () => {
    //TODO: Implement logout
    navigate('/home');
  };

  return (
    <Menu>
      <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
        {<CgProfile size={'2em'} />}
      </MenuButton>
      <MenuList>
        <MenuItem onClick={() => navigate('/profile')}>Profile</MenuItem>
        <MenuItem onClick={handleLogoutClick}>Logout</MenuItem>
      </MenuList>
    </Menu>
  );
};