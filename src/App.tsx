import { MapContext } from './components/MapCard';
import { TabBar } from './components/TabBar';
import { DashboardView } from './components/views/DashboardView';
import { FaresView } from './components/views/FaresView';
import { JourneyView } from './components/views/JourneyView';
import { RideView } from './components/views/RideView';
import { StatusView } from './components/views/StatusView';
import { SpriteDefs } from './components/ui/Icon';
import { Pill } from './components/ui/Pill';
import { useMzansiRide } from './hooks/useMzansiRide';
import { useView } from './hooks/useView';

export default function App() {
  const app = useMzansiRide();
  const { desk, toggleView } = useView();

  return (
    <MapContext.Provider
      value={{ labels: app.labels, pins: app.pins, awsLive: app.awsLive, registerMap: app.registerMap }}
    >
      <SpriteDefs />

      {/* Phone frame (becomes a full-window layout in desktop view) */}
      <div
        className={[
          'relative flex h-[min(880px,calc(100vh_-_24px))] w-[410px] flex-col overflow-hidden rounded-[48px] border-[10px] border-[#17181b] bg-app shadow-[0_0_0_2px_#2a2b30]',
          // notch
          "before:absolute before:left-1/2 before:top-[10px] before:z-20 before:h-[28px] before:w-[110px] before:-translate-x-1/2 before:rounded-[20px] before:bg-black before:content-['']",
          // real phones: fill the screen
          'max-[480px]:h-dvh max-[480px]:w-full max-[480px]:rounded-none max-[480px]:border-0 max-[480px]:shadow-none max-[480px]:before:hidden',
          // desktop view: sidebar + content
          'desk:h-dvh desk:w-full desk:flex-row desk:rounded-none desk:border-0 desk:shadow-none desk:before:hidden',
        ].join(' ')}
      >
        <main
          ref={app.screenRef}
          id="screen"
          className="flex-1 overflow-y-auto px-[18px] pb-4 pt-[46px] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden max-[480px]:pt-[18px] desk:px-[34px] desk:pb-14 desk:pt-[26px] desk:[&>*]:mx-auto desk:[&>*]:max-w-[1240px]"
        >
          <div className="mb-3 flex items-center justify-between gap-2">
            <div className="text-[17px] font-semibold">
              <span>{app.greeting}</span> <b className="text-ac">Siyabonga</b>!
            </div>
            <Pill tone={app.status.green ? 'green' : 'amber'} dot>
              <span>{app.status.text}</span>
            </Pill>
          </div>

          <div className="mb-3 rounded-xl border border-[#3d3216] bg-[#221d10] px-2.5 py-2 text-[11px] text-[#c9a35a]">
            <b>Prototype.</b> Trips, driver, GPS and messages are simulated. AI guidance does not replace emergency
            services: SAPS 10111, or 112 from a mobile.
          </div>

          <RideView app={app} />
          <JourneyView app={app} />
          <DashboardView app={app} />
          <FaresView app={app} />
          <StatusView app={app} />
        </main>

        <TabBar tab={app.tab} onChange={app.switchTab} />
      </div>

      <button
        type="button"
        onClick={toggleView}
        className="fixed bottom-4 right-[18px] z-50 hidden cursor-pointer rounded-full border border-ac-bd bg-[#16241f] px-3.5 py-2 text-[12.5px] font-semibold text-ac min-[900px]:block"
      >
        {desk ? 'Phone view' : 'Desktop view'}
      </button>
    </MapContext.Provider>
  );
}
