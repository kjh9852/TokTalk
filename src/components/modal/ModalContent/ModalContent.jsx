import { useModalStore } from "@/store/modalStore";

import NickNameForm from "@/components/form/NickNameForm";
import PostForm from "@/components/form/PostForm";
import InfoContent from "@/components/modal/InfoContent";
import PostEditList from "@/components/post/PostEdit/PostEditList";
import Setting from "@/components/setting/Setting";

export default function ModalContent({ closeForm, onSetNickName, nickname }) {
  const modalType = useModalStore((state) => state.modalType);
  console.log(nickname);
  return (
    <>
      {modalType === "nickname" && (
        <NickNameForm
          defaultValue={nickname}
          closeForm={closeForm}
          onSetNickName={onSetNickName}
        />
      )}
      {modalType === "post" && (
        <PostForm closeForm={closeForm} nickname={nickname} />
      )}
      {modalType === "postedit" && <PostEditList />}
      {modalType === "info" && <InfoContent />}
      {modalType === "setting" && <Setting />}
    </>
  );
}
