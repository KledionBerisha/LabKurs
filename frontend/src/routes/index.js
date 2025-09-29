import { lazy } from 'react'

// use lazy for better code splitting, a.k.a. load faster
const Dashboard = lazy(() => import('../pages/Dashboard'))
const Forms = lazy(() => import('../pages/Forms'))
const Cards = lazy(() => import('../pages/Cards'))
const Charts = lazy(() => import('../pages/Charts'))
const Buttons = lazy(() => import('../pages/Buttons'))
const Modals = lazy(() => import('../pages/Modals'))
const Tables = lazy(() => import('../pages/Tables'))
const Page404 = lazy(() => import('../pages/404'))
const Blank = lazy(() => import('../pages/Blank'))
const InfermierDashboard = lazy(()=>import('../pages/InfermierDashboard'))
const ShtoPacientin = lazy(()=>import('../pages/ShtoPacientin'))
const DocotorPage = lazy(()=>import('../pages/DoctorPage'))
const Pacienti = lazy(()=>import('../pages/Pacienti'))
const EditPacientin = lazy(() =>import('../pages/EditPacientin'))
const VizitaFundit = lazy(() =>import('../pages/VizitaFundit'))
const VizitaShto = lazy(() =>import('../pages/VizitaShto'))
const PlanetsAndSatellites232470151 = lazy(() => import('../pages/PlanetsAndSatellites232470151'))
const LigjeruesDheLigjerata = lazy(() => import('../pages/LigjeruesDheLigjerata'))

/**
 * ⚠ These are internal routes!
 * They will be rendered inside the app, using the default `containers/Layout`.
 * If you want to add a route to, let's say, a landing page, you should add
 * it to the `App`'s router, exactly like `Login`, `CreateAccount` and other pages
 * are routed.
 *
 * If you're looking for the links rendered in the SidebarContent, go to
 * `routes/sidebar.js`
 */
const routes = [
  {
    path: '/dashboard', // the url
    component: Dashboard, // view rendered
  },
  {
    path: '/forms',
    component: Forms,
  },
  {
    path: '/cards',
    component: Cards,
  },
  {
    path: '/charts',
    component: Charts,
  },
  {
    path: '/buttons',
    component: Buttons,
  },
  {
    path: '/modals',
    component: Modals,
  },
  {
    path: '/tables',
    component: Tables,
  },
  {
    path: '/404',
    component: Page404,
  },
  {
    path: '/blank',
    component: Blank,
  },
  {
    path: '/InfermierDashboard',
    component: InfermierDashboard,
  },
  {
    path: '/ShtoPacientin',
    component: ShtoPacientin,
  },
  {
    path: '/DoctorPage',
    component: DocotorPage,
  },
  {
    path: '/Pacienti',
    component: Pacienti,
  },
  {
    path: '/EditPacientin',
    component: EditPacientin,
  },
  {
    path: '/VizitaFundit',
    component: VizitaFundit,
  },
  {
    path: '/VizitaShto',
    component: VizitaShto,
  },
  {
    path: '/PlanetsAndSatellites232470151',
    component: PlanetsAndSatellites232470151,
  },
  {
    path: '/LigjeruesDheLigjerata',
    component: LigjeruesDheLigjerata,
  }
]

export default routes
