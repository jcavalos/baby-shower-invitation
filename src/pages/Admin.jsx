
import { useEffect, useMemo, useState } from "react";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";

import { auth } from "../firebase/auth";
import {
  subscribeToFamilies,
  syncFamiliesFromGuests,
} from "../firebase/rsvp";

import { GUESTS } from "../data/guests";
import eventData, { siteUrl } from "../data/eventData";

const input =
  "w-full rounded-lg border border-[var(--color-sand)] bg-white px-3 py-2 text-base outline-none focus:border-[var(--color-clay)]";

const btn =
  "min-h-11 rounded-full bg-[var(--color-cocoa-deep)] px-5 py-2 text-sm text-[var(--color-cream)] disabled:opacity-40";

const linkOf = (id) => `${siteUrl}/?f=${id}`;

export default function Admin() {
  const [user, setUser] = useState(undefined);
  const [families, setFamilies] = useState([]);

  const [cred, setCred] = useState({
    email: "",
    pass: "",
  });

  const [err, setErr] = useState("");
  const [syncMessage, setSyncMessage] = useState("");
  const [copied, setCopied] = useState("");
  const [busy, setBusy] = useState(false);

  // Autenticación
  useEffect(() => {
    if (!auth) {
      setUser(null);
      return;
    }

    return onAuthStateChanged(auth, setUser);
  }, []);

  // Escuchar familias en Firebase
  useEffect(() => {
    if (!user) return;

    return subscribeToFamilies(setFamilies);
  }, [user]);

  // Estadísticas
  const stats = useMemo(() => {
    const s = {
      rosa: { cap: 0, ok: 0 },
      azul: { cap: 0, ok: 0 },
      pend: 0,
      no: 0,
    };

    families.forEach((f) => {
      const side = f.side === "azul" ? "azul" : "rosa";

      s[side].cap += Number(f.maxGuests || 0);

      if (f.status === "si") {
        s[side].ok += Number(f.confirmedGuests || 0);
      } else if (f.status === "no") {
        s.no++;
      } else {
        s.pend++;
      }
    });

    return s;
  }, [families]);

  const sorted = [...families].sort((a, b) =>
    (a.side + a.name).localeCompare(b.side + b.name)
  );

  const confirmed = stats.rosa.ok + stats.azul.ok;
  const assigned = stats.rosa.cap + stats.azul.cap;

  // Iniciar sesión
  const login = async (e) => {
    e.preventDefault();
    setErr("");

    try {
      await signInWithEmailAndPassword(
        auth,
        cred.email,
        cred.pass
      );
    } catch {
      setErr("Correo o contraseña incorrectos.");
    }
  };

  // SINCRONIZAR GUESTS.JS CON FIREBASE
  const sync = async () => {
    if (busy) return;

    setBusy(true);
    setSyncMessage("");

    try {
      const result = await syncFamiliesFromGuests(GUESTS);

      setSyncMessage(
        `¡Sincronización completada! ${result.created} familias nuevas, ${result.updated} actualizadas. Total en archivo: ${result.total}.`
      );
    } catch (error) {
      console.error("Error al sincronizar invitados:", error);

      setSyncMessage(
        `No se pudo sincronizar: ${error.message}`
      );
    } finally {
      setBusy(false);
    }
  };

  // Copiar enlace individual
  const copy = async (id) => {
    try {
      await navigator.clipboard.writeText(linkOf(id));

      setCopied(id);

      setTimeout(() => setCopied(""), 1500);
    } catch {
      setSyncMessage("No se pudo copiar el enlace.");
    }
  };

  // Mensaje de WhatsApp
  const wa = (f) =>
    `https://wa.me/?text=${encodeURIComponent(
      `¡Hola ${f.name}! 🧸 Los invitamos al baby shower de ${eventData.babyName}. Abre tu invitación y confirma aquí: ${linkOf(f.id)}`
    )}`;

  // Cargando autenticación
  if (user === undefined) {
    return (
      <p className="p-8 text-center">
        Cargando…
      </p>
    );
  }

  // Pantalla de inicio de sesión
  if (!user) {
    return (
      <main className="mx-auto max-w-xs px-6 py-20">
        <h1 className="font-[var(--font-script)] text-3xl text-[var(--color-cocoa-deep)]">
          Panel de invitados
        </h1>

        <form
          onSubmit={login}
          className="mt-6 space-y-3"
        >
          <input
            className={input}
            type="email"
            placeholder="Correo"
            value={cred.email}
            onChange={(e) =>
              setCred({
                ...cred,
                email: e.target.value,
              })
            }
            required
          />

          <input
            className={input}
            type="password"
            placeholder="Contraseña"
            value={cred.pass}
            onChange={(e) =>
              setCred({
                ...cred,
                pass: e.target.value,
              })
            }
            required
          />

          {err && (
            <p className="text-xs text-red-700">
              {err}
            </p>
          )}

          <button className={`${btn} w-full`}>
            Entrar
          </button>
        </form>
      </main>
    );
  }

  // Panel de administración
  return (
    <main className="mx-auto max-w-3xl px-4 py-10">

      {/* ENCABEZADO */}
      <div className="flex items-center justify-between">
        <h1 className="font-[var(--font-script)] text-3xl text-[var(--color-cocoa-deep)]">
          Confirmaciones
        </h1>

        <button
          onClick={() => signOut(auth)}
          className="text-sm underline"
        >
          Salir
        </button>
      </div>

      {/* ESTADÍSTICAS */}
      <div className="mt-5 rounded-2xl bg-white p-4 shadow-sm">

        <p className="text-sm">
          Confirmados <b>{confirmed}</b> de{" "}
          {eventData.capacity} lugares · asignados{" "}
          {assigned} · libres{" "}
          {eventData.capacity - assigned}
        </p>

        <div className="mt-2 h-3 overflow-hidden rounded-full bg-[var(--color-cream-dark)]">
          <div
            className="h-full bg-[var(--color-clay)] transition-all"
            style={{
              width: `${Math.min(
                100,
                (confirmed / eventData.capacity) * 100
              )}%`,
            }}
          />
        </div>

        <p className="mt-3 text-xs text-[var(--color-cocoa)]/80">
          🩷 Rosa: {stats.rosa.ok}/{stats.rosa.cap}
          {" · "}
          💙 Azul: {stats.azul.ok}/{stats.azul.cap}
          {" · "}
          Sin responder: {stats.pend}
          {" · "}
          No asisten: {stats.no}
        </p>
      </div>

      {/* SINCRONIZACIÓN */}
      <section className="mt-6 rounded-2xl border border-[var(--color-sand)] bg-white p-4">

        <h2 className="font-semibold text-[var(--color-cocoa-deep)]">
          Lista oficial de invitados
        </h2>

        <p className="mt-1 text-sm text-[var(--color-cocoa)]/80">
          La información se obtiene de src/data/guests.js.
          Actualmente tienes {GUESTS.length} familias
          configuradas.
        </p>

        <button
          onClick={sync}
          disabled={busy}
          className={`${btn} mt-4 w-full`}
        >
          {busy
            ? "Sincronizando invitados..."
            : "Sincronizar invitados desde guests.js"}
        </button>

        {syncMessage && (
          <p
            className="mt-3 text-sm"
            role="status"
          >
            {syncMessage}
          </p>
        )}

      </section>

      {/* LISTA DE FAMILIAS */}
      <h2 className="mt-8 font-semibold text-[var(--color-cocoa-deep)]">
        Familias registradas ({families.length})
      </h2>

      <ul className="mt-4 space-y-2">

        {sorted.map((f) => (
          <li
            key={f.id}
            className="rounded-xl border border-[var(--color-sand)] bg-white/80 p-3 text-sm"
          >

            <div className="flex flex-wrap items-center justify-between gap-2">

              <p>
                <span aria-hidden>
                  {f.side === "azul" ? "💙" : "🩷"}
                </span>{" "}

                <b>{f.name}</b>{" "}

                <span className="text-[var(--color-cocoa)]/70">
                  {f.status === "si"
                    ? `✅ ${f.confirmedGuests}/${f.maxGuests}`
                    : f.status === "no"
                    ? "❌ no asiste"
                    : `⏳ pendiente (${f.maxGuests})`}
                </span>
              </p>

              <div className="flex gap-3">

                <button
                  onClick={() => copy(f.id)}
                  className="min-h-11 underline"
                >
                  {copied === f.id
                    ? "¡Copiado!"
                    : "Copiar link"}
                </button>

                <a
                  href={wa(f)}
                  target="_blank"
                  rel="noreferrer"
                  className="flex min-h-11 items-center underline"
                >
                  WhatsApp
                </a>

              </div>
            </div>

            {f.comment && (
              <p className="mt-1 italic text-[var(--color-cocoa)]/80">
                “{f.comment}”
              </p>
            )}

          </li>
        ))}

      </ul>

    </main>
  );
}
