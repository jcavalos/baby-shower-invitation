import { useEffect, useState } from "react";
import { getFamily, saveRSVP } from "../firebase/rsvp";
import AnimatedBackground from "./AnimatedBackground";
import BalloonBurst from "./BalloonBurst";

// Cada familia entra con su link personal: https://tusitio/?f=<código>
const token = new URLSearchParams(window.location.search).get("f");

const label = "text-xs uppercase tracking-widest text-[var(--color-cocoa)]/70";
const lugares = (n) => `${n} ${n === 1 ? "lugar" : "lugares"}`;

export default function RSVPForm() {
  const [family, setFamily] = useState(null);
  const [state, setState] = useState(token ? "loading" : "nolink"); // loading | nolink | notfound | error | ready | saving | done
  const [attending, setAttending] = useState(null); // "si" | "no"
  const [guests, setGuests] = useState(1);
  const [comment, setComment] = useState("");
  const [saveError, setSaveError] = useState(false);

  useEffect(() => {
    if (!token) return;
    let alive = true;
    getFamily(token)
      .then((f) => {
        if (!alive) return;
        if (!f) return setState("notfound");
        setFamily(f);
        setGuests(f.confirmedGuests || f.maxGuests);
        setComment(f.comment || "");
        if (f.status === "si" || f.status === "no") {
          setAttending(f.status);
          setState("done");
        } else setState("ready");
      })
      .catch(() => alive && setState("error"));
    return () => { alive = false; };
  }, []);

  const max = family?.maxGuests || 1;
  const step = (d) => setGuests((g) => Math.min(max, Math.max(1, g + d)));

  const submit = async (e) => {
    e.preventDefault();
    if (!attending) return;
    setSaveError(false);
    setState("saving");
    try {
      await saveRSVP(token, { status: attending, guests, comment });
      setFamily((f) => ({ ...f, status: attending, confirmedGuests: attending === "si" ? guests : 0 }));
      setState("done");
    } catch (err) {
      console.error(err);
      setSaveError(true);
      setState("ready");
    }
  };

  const card = "relative mt-8 rounded-2xl border border-[var(--color-sand)] bg-white/70 px-6 py-8 backdrop-blur-sm";

  let body;
  if (state === "loading") {
    body = <div className={`${card} animate-pulse`}><div className="mx-auto h-5 w-40 rounded bg-[var(--color-cream-dark)]" /><div className="mx-auto mt-4 h-12 w-full rounded-full bg-[var(--color-cream-dark)]" /></div>;
  } else if (state === "nolink" || state === "notfound" || state === "error") {
    body = (
      <div className={card}>
        <p className="text-3xl">💌</p>
        <p className="mt-3 text-sm sm:text-base text-[var(--color-cocoa)]/85">
          {state === "error"
            ? "No pudimos cargar tu invitación. Revisa tu conexión e intenta de nuevo."
            : "Para confirmar usa el link personal que te enviamos por WhatsApp. Si no lo encuentras, pídenoslo y te lo reenviamos."}
        </p>
      </div>
    );
  } else if (state === "done") {
    const yes = attending === "si";
    body = (
      <div className="relative mt-8 rounded-2xl border border-[var(--color-sage)] bg-white/70 px-6 py-8">
        {yes && <BalloonBurst />}
        <p className="text-3xl">{yes ? "🧸" : "💛"}</p>
        <p className="mt-3 font-[var(--font-script)] text-2xl sm:text-3xl text-[var(--color-sage-dark)]">
          {yes ? "¡Gracias por confirmar!" : "Gracias por avisarnos"}
        </p>
        <p className="mt-1 text-sm sm:text-base text-[var(--color-cocoa)]/80">
          {yes
            ? `Te esperamos a ${lugares(family.confirmedGuests || guests)} de los ${family.maxGuests} reservados.`
            : "Lamentamos que no puedan acompañarnos; los llevamos en el corazón."}
        </p>
        <button onClick={() => setState("ready")} className="mt-4 min-h-11 text-sm underline text-[var(--color-cocoa)]/70">
          Cambiar mi respuesta
        </button>
      </div>
    );
  } else {
    body = (
      <form onSubmit={submit} className={`${card} space-y-6 text-left`}>
        <div className="text-center">
          <p className="font-[var(--font-script)] text-2xl sm:text-3xl text-[var(--color-cocoa-deep)]">{family.name}</p>
          <p className="mt-1 text-sm text-[var(--color-cocoa)]/80">
            {family.maxGuests === 1 ? "Tienes 1 lugar reservado" : `Tienen ${lugares(family.maxGuests)} reservados`}
          </p>
        </div>

        <div>
          <p className={label}>¿Nos acompañan?</p>
          <div className="mt-2 grid grid-cols-2 gap-3">
            {[["si", "¡Sí, ahí estaremos! 🎉"], ["no", "No podremos ir"]].map(([v, t]) => (
              <button
                type="button" key={v} aria-pressed={attending === v}
                onClick={() => setAttending(v)}
                className={`min-h-14 rounded-2xl border-2 px-3 py-3 text-sm font-semibold transition-all active:scale-95 ${
                  attending === v
                    ? "border-[var(--color-cocoa-deep)] bg-[var(--color-cocoa-deep)] text-[var(--color-cream)] shadow-md"
                    : "border-[var(--color-sand)] bg-white text-[var(--color-cocoa)]"
                }`}
              >{t}</button>
            ))}
          </div>
        </div>

        {attending === "si" && (
          <div className="text-center">
            <p className={label}>¿Cuántos asistirán?</p>
            <div className="mt-3 flex items-center justify-center gap-5">
              <button type="button" onClick={() => step(-1)} disabled={guests <= 1} aria-label="Menos personas"
                className="h-12 w-12 rounded-full border-2 border-[var(--color-sand)] bg-white text-2xl text-[var(--color-cocoa-deep)] disabled:opacity-30 active:scale-90">−</button>
              <p className="w-16 text-4xl font-[var(--font-display)] text-[var(--color-cocoa-deep)]" aria-live="polite">{guests}</p>
              <button type="button" onClick={() => step(1)} disabled={guests >= max} aria-label="Más personas"
                className="h-12 w-12 rounded-full border-2 border-[var(--color-sand)] bg-white text-2xl text-[var(--color-cocoa-deep)] disabled:opacity-30 active:scale-90">+</button>
            </div>
            <div className="mt-3 flex flex-wrap justify-center gap-1.5" aria-hidden="true">
              {Array.from({ length: max }, (_, i) => (
                <span key={i} className={`h-3 w-3 rounded-full transition-colors ${i < guests ? "bg-[var(--color-clay)]" : "bg-[var(--color-sand)]/50"}`} />
              ))}
            </div>
            <p className="mt-2 text-xs text-[var(--color-cocoa)]/60">de {max} lugares reservados para ustedes</p>
          </div>
        )}

        {attending && (
          <div>
            <label className={label} htmlFor="rsvp-comment">Un mensaje para {" "}los papás (opcional)</label>
            <textarea id="rsvp-comment" value={comment} onChange={(e) => setComment(e.target.value)}
              rows={3} maxLength={500} placeholder="Un deseo para el bebé, un consejo..."
              className="mt-1 w-full rounded-lg border border-[var(--color-sand)] bg-white px-3 py-2 text-base outline-none focus:border-[var(--color-clay)]" />
          </div>
        )}

        {saveError && <p className="text-xs text-red-700" role="alert">No se pudo enviar, intenta de nuevo en un momento.</p>}

        <button type="submit" disabled={!attending || state === "saving"}
          className="min-h-12 w-full rounded-full bg-[var(--color-cocoa-deep)] py-3 text-sm tracking-wide text-[var(--color-cream)] transition-opacity hover:opacity-90 disabled:opacity-40">
          {state === "saving" ? "Enviando..." : attending ? "Confirmar" : "Elige una opción"}
        </button>
      </form>
    );
  }

  return (
    <section className="relative overflow-hidden px-6 py-20">
      <AnimatedBackground variant="b" />
      <div className="relative z-10 mx-auto max-w-md text-center">
        <p className="font-[var(--font-display)] italic text-base sm:text-lg text-[var(--color-clay)]">confirma tu asistencia</p>
        <p className="mt-2 text-sm sm:text-base text-[var(--color-cocoa)]/80">Cuéntanos cuántos de ustedes nos acompañan.</p>
        {body}
      </div>
    </section>
  );
}
