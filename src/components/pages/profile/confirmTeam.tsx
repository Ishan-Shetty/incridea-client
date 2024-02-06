import Button from "@/src/components/button";
import Modal from "@/src/components/modal";
import Spinner from "@/src/components/spinner";
import createToast from "@/src/components/toast";
import { ConfirmTeamDocument } from "@/src/generated/generated";
import { useMutation } from "@apollo/client";
import React, { FC, useState } from "react";
import { toast } from "react-hot-toast";
import { GoVerified } from "react-icons/go";

const ConfirmTeamModal: FC<{
  teamId: string;
  canConfirm?: boolean;
  needMore?: number;
}> = ({ teamId, canConfirm, needMore }) => {
  const [showModal, setShowModal] = useState(false);

  const [confirmTeam, { loading: confirmTeamLoading }] = useMutation(
    ConfirmTeamDocument,
    {
      refetchQueries: ["RegisterdEvents"],
      awaitRefetchQueries: true,
    }
  );

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleConfirm = (teamId: string) => {
    setShowModal(false);
    let promise = confirmTeam({
      variables: {
        teamId,
      },
    }).then((res) => {
      if (res?.data?.confirmTeam.__typename !== "MutationConfirmTeamSuccess") {
        return Promise.reject("Error confirming team");
      }
    });
    createToast(promise, "Confirming");
  };

  return (
    <>
      <Button
        size={"medium"}
        className="mt-3 rounded-full justify-center !skew-x-0 bodyFont !tracking-normal"
        fullWidth
        onClick={(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
          e.preventDefault();
          e.stopPropagation();
          setShowModal(true);
        }}
        intent={"primary"}
      >
        <GoVerified />
        Confirm
      </Button>
      <Modal
        title={`Are you sure you want to confirm the team?`}
        showModal={showModal}
        onClose={handleCloseModal}
        size={"small"}
      >
        <div className="text-sm text-center px-5 mt-2 bodyFont">
          You won&apos;t be able to make changes to your team after confirming.
        </div>
        <div className="flex justify-center gap-3 my-5">
          <Button
            size={"small"}
            onClick={(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
              e.preventDefault();
              e.stopPropagation();
              canConfirm
                ? handleConfirm(teamId as string)
                : toast.error(
                    `You need ${needMore} more members to confirm your team.`,
                    {
                      position: "bottom-center",
                    }
                  );
            }}
            disabled={confirmTeamLoading}
            className="rounded-full justify-center !skew-x-0 bodyFont !tracking-normal"
          >
            {confirmTeamLoading ? (
              <Spinner intent={"white"} size={"small"} />
            ) : (
              "Confirm"
            )}
          </Button>
          <Button
            className="rounded-full justify-center !skew-x-0 bodyFont !tracking-normal"
            size={"small"}
            intent={"ghost"}
            onClick={(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
              e.preventDefault();
              e.stopPropagation();
              handleCloseModal();
            }}
          >
            Cancel
          </Button>
        </div>
      </Modal>
    </>
  );
};

export default ConfirmTeamModal;
