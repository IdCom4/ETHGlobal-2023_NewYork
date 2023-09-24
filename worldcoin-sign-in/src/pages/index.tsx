import { IDKitWidget, ISuccessResult, useIDKit } from "@worldcoin/idkit";

// TODO fill this out
const URL = "";
const app_id = "";
const actionID = "";
const action = "";
const signal = "my_signal";

export default function Home() {
  const { open, setOpen } = useIDKit();

  const handleVerify = async () => {
    // do stuff
  };

  const onSuccess = async (obj: ISuccessResult) => {
    const hash = obj.nullifier_hash;
    // redirect to custom website
    window.location.assign(URL + hash);
  };

  return (
    <main
      className={`flex min-h-screen flex-col items-center justify-between p-24`}
    >
      <IDKitWidget
        {...{
          actionID,
          action,
          app_id,
          signal,
          handleVerify,
          onSuccess,
          enableTelemetry: true,
        }}
      >
        {({ open }) => (
          <button className="" onClick={open}>
            Sign In with Worldcoin
          </button>
        )}
      </IDKitWidget>
    </main>
  );
}
