import { useState } from "react";

import useAdmin from "@/hooks/useAdmin";
import useLanguage from "@/hooks/useLanguage";

import AdminForm from "@/components/form/AdminForm";
import Button from "@/components/ui/Button/Button";
import ToggleButton from "@/components/ui/ToggleButton/ToggleButton";

import styles from "./Setting.module.css";

export default function Setting({ socket }) {
  const { isAdmin, setIsAdmin } = useAdmin();
  const [adminMode, setAdminMode] = useState(isAdmin);
  const [adminCode, setAdminCode] = useState("");
  const { t, toggleLanguage, isOn } = useLanguage();

  const handleAdminCodeChange = (e) => {
    setAdminCode(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    socket.emit("enterAdminEnter", adminCode);
    socket.once("adminConfirmed", () => {
      setIsAdmin(true);
    });
  };

  const handleExitAdmin = (e) => {
    e.preventDefault();
    socket.emit("exitAdminMode");
    socket.once("exitAdminModeConfirmed", () => {
      setIsAdmin(false);
    });
  };

  const handleAdminMode = () => {
    setAdminMode((prev) => (prev ? false : true));
  };

  return (
    <div className={styles.container}>
      <div className={styles.toggleContainer}>
        <ToggleButton
          title={t.setting.language}
          leftLabel="KR"
          rightLabel="EN"
          onClick={toggleLanguage}
          isToggleOn={isOn}
        />
        <ToggleButton
          title={t.setting.admin}
          leftLabel="OFF"
          rightLabel="ON"
          onClick={handleAdminMode}
          isToggleOn={isAdmin}
        />
      </div>
      {adminMode && (
        <AdminForm
          isAdmin={isAdmin}
          onSubmit={handleSubmit}
          defaultValue={adminCode}
          onChange={handleAdminCodeChange}
        />
      )}
      {isAdmin && (
        <div>
          <p className={styles.text}>Admin Mode</p>
          <Button onClick={handleExitAdmin}>해제</Button>
        </div>
      )}
    </div>
  );
}
