import React from "react";
import setting from "./views/Settings/setting";
// import Setting from './views/Setting/Setting'

// import Users from './views/User'
// import UserView from './views/User/View'

const ChangePassword = React.lazy(() =>
  import("./views/Profile/ChangePassword")
);
const UpdateProfile = React.lazy(() => import("./views/Profile/UpdateProfile"));

const Lottery = React.lazy(() => import("./views/Lottery"));
const ViewLottery = React.lazy(() => import("./views/Lottery/view"));
const Report = React.lazy(() => import("./views/Report"));
const routes = [
  {
    path: "/change-password",
    exact: true,
    name: "Change Password",
    component: ChangePassword,
  },
  {
    path: "/update-profile",
    exact: true,
    name: "Update Profile",
    component: UpdateProfile,
  },

  //
  {
    path: "/lottery",
    exact: true,
    name: "Lotteries",
    component: Lottery,
  },
  {
    path: "/lottery/view/:id",
    exact: true,
    name: "Lotteries",
    component: ViewLottery,
  },
  {
    path: "/report",
    exact: true,
    name: "Report",
    component: Report,
  },
  {
    path: "/setting",
    exact: true,
    name: "settings",
    component: setting,
  },
];

export default routes;
