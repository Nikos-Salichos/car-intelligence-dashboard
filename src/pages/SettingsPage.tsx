import React, { useEffect, useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import { authApi, MfaSetup } from "../api/auth";
import { session } from "../api/session";
import { errorMessage } from "../hooks/useApi";
import { Page } from "../components/layout/Page";
import { Button } from "../components/ui/Button";
import { Field, TextInput } from "../components/ui/Field";
import { Notice } from "../components/ui/Feedback";
import { Panel } from "../components/ui/Panel";

type Message = { tone: "success" | "danger"; text: string };

/** Account: who you are, the password, and two-factor authentication (MFA) with an authenticator app. */
export const SettingsPage: React.FC = () => {
  const email = session.email();
  const [message, setMessage] = useState<Message | null>(null);
  const [busy, setBusy] = useState(false);

  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [confirm, setConfirm] = useState("");

  const [mfaOn, setMfaOn] = useState(false);
  const [setup, setSetup] = useState<MfaSetup | null>(null);
  const [code, setCode] = useState("");

  useEffect(() => {
    authApi.getMfaStatus().then(setMfaOn).catch(() => undefined); // unknown status: the switch simply stays "off"
  }, []);

  // Runs one action with the busy flag, and turns any failure into a Greek message (the server's own, if it sent one).
  const run = async (action: () => Promise<Message | void>, failure: string) => {
    setBusy(true);
    setMessage(null);
    try {
      const done = await action();
      if (done) setMessage(done);
    } catch (err) {
      setMessage({ tone: "danger", text: errorMessage(err, failure) });
    } finally {
      setBusy(false);
    }
  };

  const changePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (next !== confirm) return setMessage({ tone: "danger", text: "Ο νέος κωδικός και η επιβεβαίωση δεν ταιριάζουν." });
    if (next.length < 6) return setMessage({ tone: "danger", text: "Ο κωδικός πρέπει να έχει τουλάχιστον 6 χαρακτήρες." });
    void run(async () => {
      await authApi.changePassword(current, next);
      setCurrent("");
      setNext("");
      setConfirm("");
      return { tone: "success", text: "Ο κωδικός ενημερώθηκε!" };
    }, "Η αλλαγή κωδικού απέτυχε. Ελέγξτε τον τρέχοντα κωδικό.");
  };

  const toggleMfa = () =>
    void run(async () => {
      if (mfaOn) {
        await authApi.disableMfa();
        setMfaOn(false);
        return { tone: "success", text: "Η ταυτοποίηση δύο παραγόντων απενεργοποιήθηκε." };
      }
      setSetup(await authApi.setupMfa());
      return { tone: "success", text: "Σαρώστε τον κωδικό QR ή εισάγετε το μυστικό κλειδί στην εφαρμογή ταυτοποίησης." };
    }, "Η ενημέρωση των ρυθμίσεων MFA απέτυχε.");

  const confirmMfa = (e: React.FormEvent) => {
    e.preventDefault();
    void run(async () => {
      await authApi.verifyMfaSetup(code);
      setMfaOn(true);
      setSetup(null);
      setCode("");
      return { tone: "success", text: "Η ταυτοποίηση δύο παραγόντων ενεργοποιήθηκε!" };
    }, "Μη έγκυρος κωδικός. Ελέγξτε την εφαρμογή ταυτοποίησης.");
  };

  return (
    <Page narrow title="Ρυθμίσεις και ασφάλεια λογαριασμού">
      {message && <Notice tone={message.tone}>{message.text}</Notice>}

      <Panel title="Στοιχεία λογαριασμού">
        <Field label="Διεύθυνση email">
          <TextInput readOnly value={email || "—"} />
        </Field>
      </Panel>

      <Panel title="Ταυτοποίηση δύο παραγόντων (MFA)">
        <div className="flex items-center justify-between gap-4">
          <p className="text-xs text-gray-400">{mfaOn ? "Ο λογαριασμός σας έχει έξτρα επίπεδο ασφάλειας." : "Ασφαλίστε τον λογαριασμό με εφαρμογή ταυτοποίησης (π.χ. Google Authenticator, Authy)."}</p>
          <Button variant={mfaOn ? "danger" : "primary"} disabled={busy} onClick={toggleMfa}>
            {mfaOn ? "Απενεργοποίηση MFA" : "Ενεργοποίηση MFA"}
          </Button>
        </div>
        {!mfaOn && setup && (
          <div className="mt-4 p-4 bg-gray-950 border border-gray-800 rounded-lg flex flex-col gap-4">
            <p className="text-xs text-gray-300">1. Σαρώστε αυτόν τον κωδικό QR με την εφαρμογή ταυτοποίησης:</p>
            {setup.authenticatorUri && (
              <div className="self-center bg-white p-3 rounded-lg">
                <QRCodeSVG value={setup.authenticatorUri} size={150} level="M" />
              </div>
            )}
            <div>
              <p className="text-xs text-gray-400 mb-1">Ή εισάγετε χειροκίνητα αυτό το μυστικό κλειδί:</p>
              <div className="bg-gray-900 border border-gray-800 p-2.5 rounded text-center text-xs font-mono text-blue-400 select-all">{setup.secret}</div>
            </div>
            <form onSubmit={confirmMfa} className="flex flex-wrap items-end gap-3">
              <Field label="2. Επιβεβαιώστε τον κωδικό επαλήθευσης" className="w-56">
                <TextInput inputMode="numeric" maxLength={6} required placeholder="Κωδικός 6 ψηφίων" value={code} onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))} className="font-mono tracking-widest text-center" />
              </Field>
              <Button type="submit" disabled={busy || code.length < 6}>Επιβεβαίωση κωδικού</Button>
            </form>
          </div>
        )}
      </Panel>

      <Panel title="Αλλαγή κωδικού">
        <form onSubmit={changePassword} className="flex flex-col gap-3 max-w-md">
          <Field label="Τρέχων κωδικός"><TextInput type="password" autoComplete="current-password" required value={current} onChange={(e) => setCurrent(e.target.value)} /></Field>
          <Field label="Νέος κωδικός"><TextInput type="password" autoComplete="new-password" required value={next} onChange={(e) => setNext(e.target.value)} /></Field>
          <Field label="Επιβεβαίωση νέου κωδικού"><TextInput type="password" autoComplete="new-password" required value={confirm} onChange={(e) => setConfirm(e.target.value)} /></Field>
          <div><Button type="submit" disabled={busy}>Ενημέρωση κωδικού</Button></div>
        </form>
      </Panel>
    </Page>
  );
};

export default SettingsPage;
