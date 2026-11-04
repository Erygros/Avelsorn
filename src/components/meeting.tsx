"use client";
import { useRef, useState, useEffect } from "react";
import { Mic, MicOff, Video, VideoOff, PhoneOff } from "lucide-react";

export function Meeting({ bookingId }: { bookingId: string }) {
    const localVideo = useRef<HTMLVideoElement>(null),
        remoteVideo = useRef<HTMLVideoElement>(null);
    const peer = useRef<RTCPeerConnection | null>(null);
    const stream = useRef<MediaStream | null>(null);
    const interval = useRef<ReturnType<typeof setInterval> | null>(null);
    const token = useRef("");
    const [status, setStatus] = useState("Bereit zum Beitreten");
    const [joined, setJoined] = useState(false);
    const [microphone, setMicrophone] = useState(true);
    const [camera, setCamera] = useState(true);
    function leave() {
        if (interval.current) clearInterval(interval.current);
        interval.current = null;
        stream.current?.getTracks().forEach((track) => track.stop());
        peer.current?.close();
        peer.current = null;
        setJoined(false);
        setStatus("Verbindung beendet");
    }
    useEffect(
        () => () => {
            if (interval.current) clearInterval(interval.current);
            stream.current?.getTracks().forEach((t) => t.stop());
            peer.current?.close();
        },
        [],
    );
    async function signal(payload: unknown) {
        const response = await fetch("/api/video", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                action: "signal",
                token: token.current,
                payload,
            }),
        });
        if (!response.ok)
            throw new Error(
                "Die Verbindungsdaten konnten nicht übertragen werden.",
            );
    }
    async function join() {
        try {
            setStatus("Zugang wird geprüft …");
            const response = await fetch("/api/video", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ action: "join", bookingId }),
            });
            const access = await response.json();
            if (!response.ok) throw new Error(access.error);
            token.current = access.token;
            setStatus("Bitte gib Kamera und Mikrofon frei.");
            stream.current = await navigator.mediaDevices.getUserMedia({
                video: true,
                audio: true,
            });
            if (localVideo.current)
                localVideo.current.srcObject = stream.current;
            const connection = new RTCPeerConnection({
                iceServers: access.iceServers,
            });
            peer.current = connection;
            stream.current
                .getTracks()
                .forEach((track) =>
                    connection.addTrack(track, stream.current!),
                );
            connection.ontrack = (event) => {
                if (peer.current === connection && remoteVideo.current)
                    remoteVideo.current.srcObject = event.streams[0];
            };
            connection.onicecandidate = (event) => {
                if (peer.current === connection && event.candidate)
                    signal({ candidate: event.candidate.toJSON() }).catch((e) =>
                        setStatus(e.message),
                    );
            };
            connection.onconnectionstatechange = () => {
                if (peer.current === connection)
                    setStatus(
                        {
                            new: "Verbindung wird vorbereitet",
                            connecting: "Verbindung wird aufgebaut",
                            connected: "Verbunden",
                            disconnected: "Verbindung unterbrochen",
                            failed: "Verbindung fehlgeschlagen. Prüfe Netzwerk und TURN-Konfiguration.",
                            closed: "Verbindung beendet",
                        }[connection.connectionState],
                    );
            };
            let cursor = "";
            let expiresAt = access.expiresAt;
            let polling = false;
            const seen = new Set<string>();
            const candidates: RTCIceCandidateInit[] = [];
            interval.current = setInterval(async () => {
                if (polling) return;
                polling = true;
                try {
                    if (Date.now() > expiresAt - 120000) {
                        const renewed = await fetch("/api/video", {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({
                                action: "refresh",
                                bookingId,
                                generation: access.generation,
                            }),
                        });
                        const grant = await renewed.json();
                        if (!renewed.ok) throw new Error(grant.error);
                        token.current = grant.token;
                        expiresAt = grant.expiresAt;
                        connection.setConfiguration({
                            iceServers: grant.iceServers,
                        });
                    }
                    const r = await fetch(
                        "/api/video?after=" + encodeURIComponent(cursor),
                        {
                            headers: {
                                Authorization: "Bearer " + token.current,
                            },
                        },
                    );
                    const signals = await r.json();
                    if (peer.current !== connection) return;
                    if (!r.ok) {
                        if (r.status === 409 || r.status === 403) leave();
                        throw new Error(signals.error);
                    }
                    for (const item of signals) {
                        if (seen.has(item.id)) continue;
                        seen.add(item.id);
                        const payload = item.payload;
                        if (payload.description) {
                            await connection.setRemoteDescription(
                                payload.description,
                            );
                            while (candidates.length)
                                await connection.addIceCandidate(
                                    candidates.shift()!,
                                );
                            if (payload.description.type === "offer") {
                                const answer = await connection.createAnswer();
                                await connection.setLocalDescription(answer);
                                await signal({ description: answer });
                            }
                        } else if (payload.candidate) {
                            if (connection.remoteDescription)
                                await connection.addIceCandidate(
                                    payload.candidate,
                                );
                            else candidates.push(payload.candidate);
                        }
                        if (item.at > cursor) cursor = item.at;
                    }
                } catch (e) {
                    if (peer.current === connection || !peer.current)
                        setStatus(
                            e instanceof Error
                                ? e.message
                                : "Verbindung unterbrochen.",
                        );
                } finally {
                    polling = false;
                }
            }, 1000);
            if (access.initiator) {
                const offer = await connection.createOffer();
                await connection.setLocalDescription(offer);
                await signal({ description: offer });
            }
            setJoined(true);
            setStatus(
                access.local
                    ? "Warte auf die zweite Person · lokaler WebRTC-Modus ohne externen TURN-Dienst"
                    : "Warte auf die zweite Person",
            );
        } catch (e) {
            leave();
            setStatus(
                e instanceof Error
                    ? e.message
                    : "Kamera oder Mikrofon konnte nicht geöffnet werden. Bitte prüfe die Berechtigungen.",
            );
        }
    }
    return (
        <section className="panel">
            <p role="status" className="mb-5">
                {status}
            </p>
            <div className="grid gap-5 md:grid-cols-[2fr_1fr]">
                <div className="bg-[#edf0e7] min-h-72 relative">
                    <video
                        ref={remoteVideo}
                        autoPlay
                        playsInline
                        className="w-full h-full object-contain"
                        aria-label="Video der anderen Person"
                    />
                    <span className="absolute bottom-3 left-3 text-xs">
                        Dein Gespräch
                    </span>
                </div>
                <div className="bg-[#f5f6f2] min-h-48">
                    <video
                        ref={localVideo}
                        autoPlay
                        playsInline
                        muted
                        className="w-full h-full object-contain"
                        aria-label="Dein eigenes Video"
                    />
                </div>
            </div>
            <div className="button-row mt-6">
                {!joined ? (
                    <button className="button primary" onClick={join}>
                        Kamera und Mikrofon freigeben & beitreten ↗
                    </button>
                ) : (
                    <>
                        <button
                            className="button"
                            onClick={() => {
                                stream.current
                                    ?.getAudioTracks()
                                    .forEach((t) => (t.enabled = !microphone));
                                setMicrophone(!microphone);
                            }}
                        >
                            {microphone ? (
                                <Mic size={18} />
                            ) : (
                                <MicOff size={18} />
                            )}
                            Mikrofon{" "}
                            {microphone ? "ausschalten" : "einschalten"}
                        </button>
                        <button
                            className="button"
                            onClick={() => {
                                stream.current
                                    ?.getVideoTracks()
                                    .forEach((t) => (t.enabled = !camera));
                                setCamera(!camera);
                            }}
                        >
                            {camera ? (
                                <Video size={18} />
                            ) : (
                                <VideoOff size={18} />
                            )}
                            Kamera {camera ? "ausschalten" : "einschalten"}
                        </button>
                        <button className="button primary" onClick={leave}>
                            <PhoneOff size={18} />
                            Gespräch verlassen
                        </button>
                    </>
                )}
            </div>
            <p className="small-note">
                Keine Aufzeichnung. Medien werden für dieses Gespräch
                übertragen. Eine echte Verbindung über unterschiedliche Netze
                setzt einen geeigneten, konfigurierten Videodienst voraus.
            </p>
        </section>
    );
}
