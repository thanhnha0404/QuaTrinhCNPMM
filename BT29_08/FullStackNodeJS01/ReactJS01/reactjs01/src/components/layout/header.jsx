import React, { useContext, useState } from 'react'
import { UsergroupAddOutlined, HomeOutlined, LoginOutlined, LogoutOutlined, SearchOutlined, HeartOutlined, HeartFilled } from '@ant-design/icons'
import { Menu } from 'antd'
import { Link, useNavigate } from 'react-router-dom'
import { AuthContext } from '../context/auth.context.jsx'
import { FavoritesContext } from '../context/favorites.context.jsx'

const Header = () => {
  const navigate = useNavigate()
  const { auth, setAuth } = useContext(AuthContext)
  const { favoriteIds } = useContext(FavoritesContext)

  const setAuthNull = () => {
    setAuth({
      isAuthenticated: false,
      user: {
        email: '',
        name: '',
      },
    })
  }

  const onLogout = () => {
    localStorage.removeItem('access_token')
    setAuthNull()
    navigate('/')
  }

  const items = [
    {
      label: <Link to={'/'}>Trang chủ</Link>,
      key: 'home',
      icon: <HomeOutlined />,
    },
    {
      label: <Link to={'/search'}>Tìm kiếm nâng cao</Link>,
      key: 'search',
      icon: <SearchOutlined />,
    },
    {
      label: <Link to={'/favorites'}>Yêu thích ({favoriteIds.length})</Link>,
      key: 'favorites',
      icon: favoriteIds.length > 0 ? <HeartFilled style={{ color: 'red' }} /> : <HeartOutlined />,
    },
    ...(auth?.isAuthenticated
      ? [
          {
            label: `Welcome ${auth?.user?.email ?? ''}`,
            key: 'submenu',
            icon: <UsergroupAddOutlined />,
            children: [
              {
                label: 'Logout',
                key: 'logout',
                icon: <LogoutOutlined />,
              },
            ],
          },
        ]
      : [
          {
            label: <Link to={'/login'}>Đăng nhập</Link>,
            key: 'login',
            icon: <LoginOutlined />,
          },
          {
            label: <Link to={'/register'}>Đăng ký</Link>,
            key: 'register',
            icon: <UsergroupAddOutlined />,
          },
        ]),
  ]

  const [current, setCurrent] = useState('mail')
  const onClick = (e) => {
    if (e.key === 'logout') onLogout()
    setCurrent(e.key)
  }

  return (
    <Menu onClick={onClick} selectedKeys={[current]} mode="horizontal" items={items} />
  )
}

export default Header


