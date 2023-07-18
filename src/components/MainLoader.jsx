import { XlviLoader } from "react-awesome-loaders";
function MainLoader() {
  return (
    <div className="bg-blue-900 text-center min-h-screen flex flex-col items-center justify-center">
      <XlviLoader
        boxColors={["#FFD500", "#0077B6", "#00B4D8"]}
        desktopSize={"128px"}
      />
    </div>
  );
}
export default MainLoader;
