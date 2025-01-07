import { Button, Image, Menu, MenuButton, MenuItem, MenuList } from '@chakra-ui/react';
import { ChevronDownIcon } from '@chakra-ui/icons';
import { useNavigate } from 'react-router-dom';
import profileIcon from '../../public/icons/profileIcon.png';

interface ProfileMenuProps {
  className?: string;
}

export const ProfileMenu: React.FC<ProfileMenuProps> = ({ className }) => {
  const navigate = useNavigate();

  const handleLogoutClick = () => {
    //TODO: Implement logout
    navigate('/home');
  };

  return (
    <Menu>
      <MenuButton as={Button} rightIcon={<ChevronDownIcon />} className={className}>
        <Image src={profileIcon} boxSize="2em" />
      </MenuButton>
      <MenuList>
        <MenuItem onClick={() => navigate('/profile')}>Profile</MenuItem>
        <MenuItem onClick={handleLogoutClick}>Logout</MenuItem>
      </MenuList>
    </Menu>
  );
};