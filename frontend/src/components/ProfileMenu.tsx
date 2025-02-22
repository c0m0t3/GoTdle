import {
  Button,
  Image,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
} from '@chakra-ui/react';
import { ChevronDownIcon } from '@chakra-ui/icons';
import { useNavigate } from 'react-router-dom';
import profileIcon from '../assets/profile-icon.png';
import { useAuth } from '../providers/AuthProvider.tsx';

interface ProfileMenuProps {
  className?: string;
}

export const ProfileMenu: React.FC<ProfileMenuProps> = ({ className }) => {
  const navigate = useNavigate();
  const {
    actions: { logout },
    isAdmin,
  } = useAuth();

  return (
    <Menu>
      <MenuButton
        as={Button}
        rightIcon={<ChevronDownIcon />}
        className={className}
      >
        <Image src={profileIcon} boxSize="2em" />
      </MenuButton>
      <MenuList>
        <MenuItem onClick={() => navigate('/profile')}>Profile</MenuItem>
        {isAdmin && (
          <MenuItem onClick={() => navigate('/admin/dashboard')}>
            Admin Dashboard
          </MenuItem>
        )}
        <MenuItem onClick={logout}>Logout</MenuItem>
      </MenuList>
    </Menu>
  );
};
