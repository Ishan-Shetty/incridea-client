import { useMutation } from "@apollo/client";
import { FormEventHandler, FunctionComponent, useState } from "react";
import { BiCheckCircle, BiErrorCircle } from "react-icons/bi";
import { FaAngleLeft } from "react-icons/fa";

import Button from "~/components/button";
import Spinner from "~/components/spinner";
import { ResetPasswordEmailDocument } from "~/generated/generated";

type ResetPasswordFormProps = {
  setWhichForm: (whichForm: "signIn" | "resetPassword") => void;
  setGotDialogBox: (gotDialogBox: boolean) => void;
};

const ResetPasswordForm: FunctionComponent<ResetPasswordFormProps> = ({
  setWhichForm,
  setGotDialogBox,
}) => {
  const [email, setEmail] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  const [resetMutation, { data, loading, error: mutationError }] = useMutation(
    ResetPasswordEmailDocument,
  );

  if (mutationError) setGotDialogBox(true);

  const handleSubmit: FormEventHandler<HTMLFormElement> = async (e) => {
    // add some client side validations like empty fields, password length, etc.
    setError(null);
    e.preventDefault();
    if (email === "") return;

    await resetMutation({
      variables: {
        email: email,
      },
    }).then((res) => {
      if (res.data?.sendPasswordResetEmail.__typename === "Error") {
        setError(res.data.sendPasswordResetEmail.message);
        setGotDialogBox(true);
      }

      if (
        res.data?.sendPasswordResetEmail.__typename ===
        "MutationSendPasswordResetEmailSuccess"
      )
        setGotDialogBox(true);
    });
  };

  return (
    <>
      <form
        className={`relative flex min-h-full flex-col justify-center gap-2 px-3 py-3 ${
          loading && "pointer-events-none cursor-not-allowed"
        }`}
        onSubmit={handleSubmit}
      >
        <h2 className="pb-1 text-center text-2xl font-semibold">
          Forgot password?
        </h2>

        {data?.sendPasswordResetEmail.__typename ===
        "MutationSendPasswordResetEmailSuccess" ? (
          <>
            <div className="flex flex-col items-center gap-2 rounded-md bg-secondary-300 p-4 text-center font-semibold text-[#d7037f]">
              <BiCheckCircle size={"2rem"} /> Reset link sent to your email.
              Please check your inbox.
            </div>
          </>
        ) : (
          <>
            <h6 className="mb-10 text-center">
              Enter your email to receive a password reset link
            </h6>
            <input
              value={email}
              onChange={({ target }) => {
                setError(null);
                setEmail(target.value);
              }}
              type="email"
              required
              className="md:focus:border-[#dd5c6e]-500 border-b border-gray-400 bg-transparent px-1 py-2 outline-none transition-all placeholder:text-slate-400"
              placeholder="Email"
            />

            <Button type="submit" className="mt-4">
              Send Reset Link
            </Button>

            {loading && (
              <div className="absolute inset-0 z-10 h-full w-full cursor-not-allowed rounded-lg bg-gradient-to-b from-[#1f2e97] to-[#090d4b] opacity-60">
                <Spinner className="text-[#dd5c6e]" intent={"white"} />
              </div>
            )}

            {(error ?? mutationError) && (
              <div className="flex min-w-full items-center gap-3 overflow-x-auto rounded-md bg-red-100 p-2 px-4 font-semibold text-red-500">
                <BiErrorCircle size={"1.3rem"} />
                {error ?? mutationError?.message}
              </div>
            )}
          </>
        )}
        <Button
          intent={"ghost"}
          className="mt-5"
          onClick={() => setWhichForm("signIn")}
        >
          <FaAngleLeft /> Go Back
        </Button>
      </form>
    </>
  );
};

export default ResetPasswordForm;
