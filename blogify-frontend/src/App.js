import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { useSelector } from 'react-redux';
import Homepage from './components/Homepage/Homepage';
import Login from './components/Users/Login';
import PublicNavbar from './components/Navbar/PublicNavbar';
import PrivateNavbar from './components/Navbar/PrivateNavbar';
import ProtectedRoute from './components/AuthRoute/ProtectedRoute';
import AddPost from './components/Posts/AddPost';
import PostDetails from './components/Posts/PostDetails';
import PostList from './components/Posts/PostList';
import PublicProfile from './components/Users/PublicProfile';
import PrivateUserProfile from './components/Users/PrivateProfile';
import AccountVerification from './components/Users/AccountVerification';
import PasswordResetRequest from './components/Users/ResetPasswordRequest';
import PasswordReset from './components/Users/PasswordReset';
import UpdateUser from './components/Users/UpdateUser';








export default function App() {
  //Get the login user from store
  const { userAuth } = useSelector((state) => state?.users)
  const isLogin = userAuth?.userInfo?.token
  return (
    <BrowserRouter>
      {/* Navbar here */}
      {isLogin ? <PrivateNavbar /> : <PublicNavbar />}
      <Routes>
        {/*homepage*/}
        <Route path='' element={<Homepage />}> </Route>

        {/* login */}
        <Route path="/login" element={<Login />}> </Route>

        {/* public profile */}
        <Route path="/public-profile/:id" element={<ProtectedRoute>
          <PublicProfile />
        </ProtectedRoute>}> </Route>

        {/* private profile */}
        <Route path="/user-profile" element={<ProtectedRoute>
          <PrivateUserProfile />
        </ProtectedRoute>}> </Route>

        {/* verify-account */}
        <Route path="/account-verification/:verifyToken" element={<ProtectedRoute>
          <AccountVerification />
        </ProtectedRoute>}> </Route>

        {/* add post */}
        <Route path="/add-post" element={<ProtectedRoute>
          <AddPost />
        </ProtectedRoute>}> </Route>

        {/*post detail*/}
        <Route path='/posts/:postID' element={<ProtectedRoute>
          <PostDetails />
        </ProtectedRoute>}>
        </Route>

        {/*post list*/}
        <Route path='/posts' element={<ProtectedRoute>
          <PostList />
        </ProtectedRoute>}>
        </Route>

         {/*update profile*/}
         <Route path='/update-profile' element={<ProtectedRoute>
          <UpdateUser />
        </ProtectedRoute>}>
        </Route>


        {/*password reset request*/}
        <Route path="/forgot-password" element={<PasswordResetRequest />}> </Route>

        {/* password reset */}
        <Route path="/reset-password/:token" element={<PasswordReset />}> </Route>

      </Routes>
    </BrowserRouter>
  )
}