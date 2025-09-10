import React, { useContext, useState } from 'react'
import { SidebarContext } from '../context/SidebarContext'
import {
  BellIcon,
  MenuIcon,
  OutlinePersonIcon,
  OutlineLogoutIcon,
} from '../icons'
import { Avatar, Badge, Dropdown, DropdownItem, WindmillContext, Modal, ModalBody } from '@windmill/react-ui'
import AuthService from '../services/auth.service'
import { useHistory } from 'react-router-dom'
import EditProfile from '../pages/EditProfile'

function Header() {
  const { mode, toggleMode } = useContext(WindmillContext)
  const { toggleSidebar } = useContext(SidebarContext)

  const [isNotificationsMenuOpen, setIsNotificationsMenuOpen] = useState(false)
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false)
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false)
  const [profileUser, setProfileUser] = useState(null)

  function handleNotificationsClick() {
    setIsNotificationsMenuOpen(!isNotificationsMenuOpen)
  }

  function handleProfileClick() {
    setIsProfileMenuOpen(!isProfileMenuOpen)
  }

  async function openProfileModal(e) {
    if (e && e.preventDefault) e.preventDefault()
    setIsProfileMenuOpen(false)
    setProfileUser(null)

    const token = AuthService.getToken && AuthService.getToken()
    const stored = AuthService.getCurrentUser && AuthService.getCurrentUser()

    if (!token) {
      // no token — show stored user (if any)
      setProfileUser(stored || null)
      setIsProfileModalOpen(true)
      return
    }

    try {
      const res = await fetch('http://localhost:8080/api/users/me', {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (res.ok) {
        const data = await res.json()
        setProfileUser(data || stored || null)
      } else {
        // fallback to stored user when API call fails (401/other)
        setProfileUser(stored || null)
      }
    } catch (err) {
      setProfileUser(stored || null)
    } finally {
      setIsProfileModalOpen(true)
    }
  }

  function closeProfileModal() {
    setIsProfileModalOpen(false)
  }

  const history = useHistory()
  const handleLogout = () => {
    AuthService.logout()
    history.push('/login')
  }

  return (
    <header className="z-40 py-4 bg-white shadow-bottom dark:bg-gray-800">
      <div className="container flex items-center justify-between h-full px-6 mx-auto text-purple-600 dark:text-purple-300">
        <button
          className="p-1 mr-5 -ml-1 rounded-md lg:hidden focus:outline-none focus:shadow-outline-purple"
          onClick={toggleSidebar}
          aria-label="Menu"
        >
          <MenuIcon className="w-6 h-6" aria-hidden="true" />
        </button>
        <ul className="w-full flex justify-end items-center px-6 py-4 bg-white dark:bg-gray-800 space-x-6">
          <li className="relative">
            <button
              className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none"
              onClick={handleNotificationsClick}
              aria-label="Notifications"
              aria-haspopup="true"
            >
              <BellIcon className="w-5 h-5 text-purple-600 dark:text-purple-400" aria-hidden="true" />
              <span
                aria-hidden="true"
                className="absolute top-0 right-0 w-3 h-3 bg-red-600 border-2 border-white dark:border-gray-800 rounded-full transform translate-x-1/2 -translate-y-1/2"
              />
            </button>

            <Dropdown align="right" isOpen={isNotificationsMenuOpen} onClose={() => setIsNotificationsMenuOpen(false)}>
              <DropdownItem tag="a" href="#" className="justify-between">
                <span>Alergji</span>
                <Badge type="danger">1</Badge>
              </DropdownItem>
              <DropdownItem onClick={() => alert('Alerts!')}>
                <span>Message</span>
              </DropdownItem>
            </Dropdown>
          </li>

          <li className="relative">
            <button
              className="rounded-full focus:shadow-outline-purple focus:outline-none"
              onClick={handleProfileClick}
              aria-label="Account"
              aria-haspopup="true"
            >
              <Avatar className="align-middle" alt="" aria-hidden="true" />
            </button>

            <Dropdown align="right" isOpen={isProfileMenuOpen} onClose={() => setIsProfileMenuOpen(false)}>
              <DropdownItem tag="button" onClick={openProfileModal}>
                <OutlinePersonIcon className="w-4 h-4 mr-3" aria-hidden="true" />
                <span>Profile</span>
              </DropdownItem>
              <DropdownItem onClick={handleLogout}>
                <OutlineLogoutIcon className="w-4 h-4 mr-3" aria-hidden="true" />
                <span>Log out</span>
              </DropdownItem>
            </Dropdown>

            <Modal isOpen={isProfileModalOpen} onClose={closeProfileModal}>
              <ModalBody>
                <EditProfile user={profileUser} onClose={closeProfileModal} />
              </ModalBody>
            </Modal>
          </li>
        </ul>
      </div>
    </header>
  )
}

export default Header;