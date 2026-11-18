import { useState, useEffect } from "react";

// ─── KLEUREN ────────────────────────────────────────────────────────────────
// Donkergroen = de kisten van de bouquinistes. Metrolijnen krijgen hun echte kleur.
// De kleuren staan als CSS-variabelen, zodat de pagina meegaat met licht/donker op het toestel.
const T = {
  bg: "var(--bg)",
  card: "var(--card)",
  ink: "var(--ink)",
  dim: "var(--dim)",
  line: "var(--line)",
  accent: "var(--accent)",
  accentBg: "var(--accent-bg)",
  soft: "var(--soft)",
  softInk: "var(--soft-ink)",
  amber: "var(--amber-ink)",
  amberSoft: "var(--amber-soft)",
};

const DARK_VARS = `--bg:#12181D;--card:#1B242B;--ink:#E8EDF1;--dim:#9AA7B1;--line:#2C3841;--accent:#86D3AB;--accent-bg:#1E4D3A;--soft:#1F3A2E;--soft-ink:#A9E2C4;--amber-ink:#F2C879;--amber-soft:#3A2E12;color-scheme:dark;`;

const THEME_CSS = `
:root{--bg:#F3F5F7;--card:#FFFFFF;--ink:#18222D;--dim:#56636E;--line:#DCE1E6;--accent:#1E4D3A;--accent-bg:#1E4D3A;--soft:#E3EEE8;--soft-ink:#1E4D3A;--amber-ink:#7A4E00;--amber-soft:#FFF1CF;color-scheme:light;}
@media (prefers-color-scheme: dark){:root:not([data-theme="light"]){${DARK_VARS}}}
:root[data-theme="dark"]{${DARK_VARS}}
*{box-sizing:border-box;}
html,body{margin:0;padding:0;background:var(--bg);color:var(--ink);}
`;

const LIJN = {
  "1": { bg: "#FFCE00", fg: "#18222D" },
  "2": { bg: "#0064B0", fg: "#FFFFFF" },
  "3": { bg: "#9F9825", fg: "#FFFFFF" },
  "4": { bg: "#C04191", fg: "#FFFFFF" },
  "5": { bg: "#F28E42", fg: "#18222D" },
  "6": { bg: "#6ECA97", fg: "#18222D" },
  "7": { bg: "#FA9ABA", fg: "#18222D" },
  "7b": { bg: "#6ECA97", fg: "#18222D" },
  "8": { bg: "#CEADD2", fg: "#18222D" },
  "9": { bg: "#B6BD00", fg: "#18222D" },
  "10": { bg: "#DFB039", fg: "#18222D" },
  "11": { bg: "#704B1C", fg: "#FFFFFF" },
  "12": { bg: "#007852", fg: "#FFFFFF" },
  "13": { bg: "#6EC4E8", fg: "#18222D" },
};

const serif = "Georgia, 'Times New Roman', serif";
const sans = "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";

const kaart = (q) => `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(q)}`;
const fotos = (q) => `https://www.google.com/search?tbm=isch&q=${encodeURIComponent(q)}`;

// ─── DATA: HIGHLIGHTS PER WIJK ──────────────────────────────────────────────
const WIJKEN = [
  {
    id: "marais",
    kort: "Marais",
    naam: "Le Marais (Haut-Marais)",
    sub: "3e arrondissement, het noordelijke deel richting Place de la République",
    vanHotel: "Lijn 5 vanaf Gare de l’Est naar République: 2 haltes.",
    items: [
      {
        id: "haut-marais",
        titel: "Haut-Marais: conceptstores, galeries en koffie",
        tekst:
          "Het noordelijke deel van de Marais, richting Place de la République. Hier vind je conceptstores, kunstgalerieën, boetieks en koffiebars. Rustig rondslenteren, een vast programma is niet nodig.",
        extra:
          "Tip: rond Rue de Bretagne en Rue Charlot is het kleinschalig en gezellig. In de overdekte Marché des Enfants Rouges (39 rue de Bretagne) kun je lunchen.",
        metro: [
          { station: "République", lijnen: ["3", "5", "8", "9", "11"] },
          { station: "Filles du Calvaire", lijnen: ["8"] },
          { station: "Temple", lijnen: ["3"] },
        ],
        tags: [],
        foto: "Haut-Marais Paris rue de Bretagne boutiques",
        plek: "Rue de Bretagne, 75003 Paris",
      },
    ],
  },
  {
    id: "bastille",
    kort: "Bastille",
    naam: "Bastille",
    sub: "11e en 12e arrondissement",
    vanHotel: "Lijn 5 vanaf Gare de l’Est naar Bastille: 6 haltes.",
    items: [
      {
        id: "bastille-overdag",
        titel: "Bastille overdag",
        tekst:
          "Overdag is Bastille leuk voor een wandeling: de Colonne de Juillet midden op het plein, de Opéra Bastille en het rustige Port de l’Arsenal, een jachthaven met een tuin die het Canal Saint-Martin met de Seine verbindt.",
        extra:
          "Op donderdag en zondag is er ’s ochtends een grote versmarkt aan Boulevard Richard-Lenoir (Marché Bastille), dus donderdag 26 november is een marktdag. Boven een oude spoorlijn loopt de Promenade Plantée (Coulée Verte René-Dumont), een verhoogde groene wandeling. Vanaf het Port de l’Arsenal begint ook de wandeling langs het Canal Saint-Martin.",
        metro: [{ station: "Bastille", lijnen: ["1", "5", "8"] }],
        tags: [
          { t: "Marktdag do en zo", k: "ok" },
          { t: "Gratis", k: "ok" },
        ],
        foto: "Place de la Bastille Port de l’Arsenal Paris",
        plek: "Place de la Bastille, 75011 Paris",
      },
    ],
  },
  {
    id: "louvre",
    kort: "Louvre & Tuileries",
    naam: "Louvre, Tuileries en de Seine",
    sub: "1e arrondissement en de kades van de Seine",
    vanHotel:
      "Lijn 7 vanaf Gare de l’Est: Pyramides (6 haltes), Palais Royal–Musée du Louvre (7 haltes) of Pont Neuf (8 haltes).",
    items: [
      {
        id: "cafe-marly",
        titel: "Koffiedrinken bij Café Marly (Louvre)",
        tekst:
          "Koffie bij het restaurant van het Louvre is leuker dan het museum zelf bezoeken. Het terras ligt onder de arcades en kijkt uit op de glazen piramide.",
        extra: "Adres: 93 rue de Rivoli, onder de arcades aan de kant van de Cour Napoléon.",
        metro: [{ station: "Palais Royal–Musée du Louvre", lijnen: ["1", "7"] }],
        tags: [
          { t: "Dagelijks 08:00–02:00", k: "ok" },
          { t: "Prijzig", k: "warn" },
        ],
        foto: "Café Marly Louvre terras glazen piramide",
        plek: "Café Marly, 93 rue de Rivoli, 75001 Paris",
      },
      {
        id: "tuileries",
        titel: "Kerstmarkt in de Tuileries",
        tekst:
          "Grote markt met veel chalets, eten en drinken, een reuzenrad en een schaatsbaan. Vooral ’s avonds druk en sfeervol. De Tuileries zijn sowieso leuk om doorheen te lopen.",
        extra: "Ligt vlak bij Café Marly: samen te doen in één wandeling.",
        metro: [
          { station: "Tuileries", lijnen: ["1"] },
          { station: "Concorde", lijnen: ["1", "8", "12"] },
          { station: "Pyramides", lijnen: ["7"] },
        ],
        tags: [
          { t: "Tot 3 januari", k: "ok" },
          { t: "Dagelijks 11:00–23:30", k: "ok" },
          { t: "Toegang gratis, attracties betaald", k: "ok" },
        ],
        foto: "Marché de Noël Tuileries Paris grande roue chalets",
        plek: "Jardin des Tuileries, 75001 Paris",
      },
      {
        id: "bouquinistes",
        titel: "Bouquinistes langs de Seine",
        tekst:
          "De beroemde openluchtboekenmarkt langs de Seine heet Les Bouquinistes. Je herkent hem aan de honderden donkergroene houten kisten op de kademuren, vol oude boeken, prenten en souvenirs.",
        extra: "Alleen de moeite bij mooi weer: bij regen blijven de kisten vaak dicht.",
        metro: [
          { station: "Pont Neuf", lijnen: ["7"] },
          { station: "Saint-Michel", lijnen: ["4"] },
          { station: "Louvre–Rivoli", lijnen: ["1"] },
        ],
        tags: [
          { t: "Alleen bij mooi weer", k: "warn" },
          { t: "Gratis", k: "ok" },
        ],
        foto: "Bouquinistes Seine Paris boekenkisten",
        plek: "Quai de la Mégisserie, 75001 Paris",
      },
    ],
  },
  {
    id: "notredame",
    kort: "Notre-Dame",
    naam: "Île de la Cité en Quartier Latin",
    sub: "4e en 6e arrondissement, op en rond het eiland in de Seine",
    vanHotel:
      "Lijn 4 rechtstreeks vanaf Gare de l’Est: Cité (7 haltes, bij Notre-Dame), Saint-Michel (8 haltes) of Odéon (9 haltes, bij de Luxembourg-tuinen).",
    items: [
      {
        id: "notre-dame",
        titel: "Notre-Dame",
        tekst:
          "De kathedraal is na de brand weer open en een bezoek is nu zeker de moeite waard. Binnen is gratis, een ticket is niet nodig. Ook alleen de buitenkant en het plein ervoor zijn mooi om te zien.",
        extra:
          "Van november tot maart is de wachttijd zonder reservering meestal 15 tot 30 minuten. Gratis reserveren kan optioneel via resa.notredamedeparis.fr, 2 tot 3 dagen van tevoren. Er zijn geen kluisjes: laat een grote tas in het hotel. Samen te doen met de Bouquinistes bij Saint-Michel.",
        metro: [
          { station: "Cité", lijnen: ["4"] },
          { station: "Saint-Michel", lijnen: ["4"] },
        ],
        tags: [
          { t: "Gratis", k: "ok" },
          { t: "Elke dag open", k: "ok" },
        ],
        foto: "Notre-Dame de Paris kathedraal na restauratie",
        plek: "Cathédrale Notre-Dame de Paris, 6 parvis Notre-Dame, 75004 Paris",
      },
      {
        id: "luxembourg",
        titel: "Jardin du Luxembourg",
        tekst:
          "Het bekendste park van de linkeroever, in het Quartier Latin. Gratis toegang en elke dag open. Fijn om rustig rond het grote bassin en het Palais du Luxembourg te lopen.",
        extra:
          "Let op: in de tweede helft van november sluit het park al rond 16:45 (de tijden hangen bij de poorten). Ga dus overdag.",
        metro: [
          { station: "Odéon", lijnen: ["4", "10"] },
          { station: "Mabillon", lijnen: ["10"] },
          { station: "Notre-Dame-des-Champs", lijnen: ["12"] },
        ],
        tags: [
          { t: "Gratis", k: "ok" },
          { t: "Sluit rond 16:45", k: "warn" },
        ],
        foto: "Jardin du Luxembourg Paris bassin Palais du Luxembourg",
        plek: "Jardin du Luxembourg, 75006 Paris",
      },
    ],
  },
  {
    id: "opera",
    kort: "Opéra",
    naam: "Opéra en de grote warenhuizen",
    sub: "9e arrondissement, boulevard Haussmann",
    vanHotel: "Lijn 7 vanaf Gare de l’Est: Chaussée d’Antin–La Fayette (4 haltes) of Opéra (5 haltes).",
    items: [
      {
        id: "lafayette",
        titel: "Kerstetalages Galeries Lafayette",
        tekst:
          "Beste keuze dit jaar: Galeries Lafayette Haussmann, 40 boulevard Haussmann. Thema “Au cœur de Noël” van Jean-Charles de Castelbajac: etalages langs de boulevard sinds 12 november en een kerstboom onder de Art Nouveau-koepel. Vanaf 24 november staat er ook een schaatsbaan op het dak met uitzicht op de Eiffeltoren (tot 3 januari).",
        extra:
          "Printemps Haussmann (64 boulevard Haussmann, “Un Noël bien tricoté”) zit in dezelfde straat, handig om de etalages te vergelijken. De Galeries Lafayette op de Champs-Élysées doet dit jaar een Super Mario-thema.",
        metro: [
          { station: "Chaussée d’Antin–La Fayette", lijnen: ["7", "9"] },
          { station: "Opéra", lijnen: ["3", "7", "8"] },
        ],
        tags: [{ t: "Etalages gratis", k: "ok" }],
        foto: "Galeries Lafayette Haussmann kerst 2026 etalages sapin coupole",
        plek: "Galeries Lafayette Haussmann, 40 boulevard Haussmann, 75009 Paris",
      },
    ],
  },
  {
    id: "canal",
    kort: "Canal",
    naam: "Canal Saint-Martin",
    sub: "10e arrondissement, de buurt van het hotel",
    vanHotel: "Ongeveer 4 minuten lopen vanaf het hotel naar het kanaal.",
    items: [
      {
        id: "kanaal",
        titel: "Wandeling langs het Canal Saint-Martin",
        tekst:
          "Populaire wandelroute van het Bassin de l’Arsenal (bij Place de la Bastille) noordwaarts langs Quai de Jemmapes en Quai de Valmy naar het Bassin de la Villette. Ongeveer 4,5 tot 6 km, circa 1,5 tot 2 uur zonder stops. Grotendeels vlak en het hele jaar te lopen.",
        extra: "Het kanaal ligt vlak bij jullie hotel, dus je kunt ook een stuk lopen en daarna terug.",
        metro: [
          { station: "Bastille (start)", lijnen: ["1", "5", "8"] },
          { station: "Jacques Bonsergent (bij het hotel)", lijnen: ["5"] },
          { station: "Stalingrad (einde)", lijnen: ["2", "5", "7"] },
          { station: "Jaurès (einde)", lijnen: ["2", "5", "7b"] },
        ],
        tags: [
          { t: "Gratis", k: "ok" },
          { t: "Vlak", k: "ok" },
          { t: "1,5–2 uur", k: "ok" },
        ],
        foto: "Canal Saint-Martin Paris passerelle quai de Valmy",
        plek: "Canal Saint-Martin, 75010 Paris",
      },
    ],
  },
  {
    id: "montmartre",
    kort: "Montmartre",
    naam: "Montmartre",
    sub: "18e arrondissement",
    vanHotel: "Lijn 4 naar Barbès–Rochechouart (2 haltes), overstappen op lijn 2 naar Anvers (1 halte).",
    items: [
      {
        id: "tertre",
        titel: "Place du Tertre en Sacré-Cœur",
        tekst:
          "Plein in het hart van Montmartre, vlak bij de Sacré-Cœur, waar schilders, portrettekenaars en silhouetknippers aan het werk zijn.",
        extra:
          "Vanaf metro Anvers kun je met de kabelbaan (funiculaire) omhoog; die werkt met een gewoon metroticket.",
        metro: [
          { station: "Anvers", lijnen: ["2"] },
          { station: "Abbesses", lijnen: ["12"] },
        ],
        tags: [{ t: "Erg toeristisch", k: "warn" }],
        foto: "Place du Tertre Montmartre schilders Sacré-Cœur",
        plek: "Place du Tertre, 75018 Paris",
      },
    ],
  },
];

// ─── DATA: RESTAURANTS ──────────────────────────────────────────────────────
const RESTAURANTS = [
  {
    id: "parisien",
    status: "gereserveerd",
    dag: "Di 24 nov",
    tijd: "19:00",
    naam: "Le Parisien",
    soort: "",
    adres: "72 boulevard de Magenta, 75010 Paris",
    metro: [{ station: "Gare de l’Est (in de buurt)", lijnen: ["4", "5", "7"] }],
    tekst: "Gereserveerd voor dinsdag 24 november om 19:00. Vlakbij Gare de l’Est en het hotel.",
    tags: [{ t: "Gereserveerd", k: "ok" }],
    plek: "Le Parisien, 72 boulevard de Magenta, 75010 Paris",
  },
  {
    id: "libertino",
    status: "gereserveerd",
    dag: "Do 26 nov",
    tijd: "18:30",
    naam: "Libertino",
    soort: "Italiaans",
    adres: "44 rue de Paradis, 75010 Paris",
    metro: [
      { station: "Poissonnière", lijnen: ["7"] },
      { station: "Gare de l’Est", lijnen: ["4", "5", "7"] },
    ],
    tekst:
      "Grote Italiaanse trattoria van Big Mamma met een retro-inrichting uit de jaren zeventig. Bekend om pasta (onder andere cacio e pepe) en pizza. Gereserveerd voor donderdag 26 november om 18:30. Dicht bij het hotel.",
    tags: [{ t: "Gereserveerd", k: "ok" }],
    plek: "Libertino, 44 rue de Paradis, 75010 Paris",
  },
  {
    id: "cornichon",
    status: "mogelijk",
    dag: "Nog niet gereserveerd",
    tijd: null,
    naam: "Le Cornichon",
    soort: "Franse bistronomie",
    adres: "34 rue Gassendi, 75014 Paris",
    metro: [
      { station: "Denfert-Rochereau", lijnen: ["4", "6"] },
      { station: "Gaîté", lijnen: ["13"] },
    ],
    tekst:
      "Gezellig buurtbistro in de 14e met Michelin Plate (2024 en 2025). Open ma–vr voor lunch (12:00–14:00) en diner (18:30–22:30), gesloten in het weekend. Menu ’s avonds ongeveer € 42, lunch ongeveer € 35. Controleer de tijden even voor je gaat.",
    extra:
      "Vanaf het hotel: lijn 4 rechtstreeks van Gare de l’Est naar Denfert-Rochereau. Reserveren: +33 1 43 20 40 19 of lecornichon.fr.",
    tags: [{ t: "Nog niet gereserveerd", k: "warn" }],
    plek: "Le Cornichon, 34 rue Gassendi, 75014 Paris",
  },
  {
    id: "chartier",
    status: "mogelijk",
    dag: "Niet te reserveren",
    tijd: null,
    naam: "Bouillon Chartier Gare de l’Est",
    soort: "Klassieke Franse bouillon",
    adres: "5 rue du 8 mai 1945, 75010 Paris",
    metro: [{ station: "Gare de l’Est", lijnen: ["4", "5", "7"] }],
    tekst:
      "Beroemde, betaalbare brasserie in de stijl van het Parijs van de jaren vijftig, recht tegenover Gare de l’Est en dus vlakbij het hotel. Dagelijks open van 11:30 tot middernacht. Een maaltijd kost ongeveer € 20 tot € 30.",
    extra:
      "Je kunt hier niet reserveren: je schuift gewoon aan. Volgens bezoekers krijg je pas een tafel als het hele gezelschap er is. Rond etenstijd kan het druk zijn.",
    tags: [{ t: "Niet te reserveren", k: "warn" }],
    plek: "Bouillon Chartier Gare de l’Est, 5 rue du 8 mai 1945, 75010 Paris",
  },
];

// ─── KLEINE ONDERDELEN ──────────────────────────────────────────────────────
function Lijn({ n }) {
  const c = LIJN[n] || { bg: T.dim, fg: "#fff" };
  return (
    <span
      aria-label={`lijn ${n === "7b" ? "7 bis" : n}`}
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        minWidth: 24,
        height: 24,
        padding: n.length > 1 ? "0 5px" : 0,
        borderRadius: 12,
        background: c.bg,
        color: c.fg,
        fontSize: 13,
        fontWeight: 700,
        fontFamily: sans,
      }}
    >
      {n === "7b" ? "7b" : n}
    </span>
  );
}

function MetroRegels({ metro }) {
  if (!metro || metro.length === 0) return null;
  return (
    <div style={{ marginTop: 12, display: "grid", gap: 6 }}>
      {metro.map((m) => (
        <div key={m.station} style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
          <span style={{ display: "inline-flex", gap: 4 }}>
            {m.lijnen.map((l) => (
              <Lijn key={l} n={l} />
            ))}
          </span>
          <span style={{ fontSize: 15, color: T.ink }}>{m.station}</span>
        </div>
      ))}
    </div>
  );
}

function Tag({ t, k }) {
  const warn = k === "warn";
  return (
    <span
      style={{
        fontSize: 13,
        fontWeight: 600,
        padding: "3px 9px",
        borderRadius: 6,
        background: warn ? T.amberSoft : T.soft,
        color: warn ? T.amber : T.softInk,
      }}
    >
      {t}
    </span>
  );
}

function Knop({ href, children }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      style={{
        flex: 1,
        textAlign: "center",
        padding: "11px 8px",
        fontSize: 15,
        fontWeight: 600,
        color: T.accent,
        border: `1.5px solid ${T.accent}`,
        borderRadius: 8,
        textDecoration: "none",
        background: T.card,
      }}
    >
      {children}
    </a>
  );
}

const kaartStijl = {
  background: T.card,
  border: `1px solid ${T.line}`,
  borderRadius: 10,
  overflow: "hidden",
};

function LetOp() {
  return (
    <div
      style={{
        margin: "24px 16px 0",
        background: T.amberSoft,
        color: T.amber,
        borderRadius: 10,
        padding: "12px 14px",
        fontSize: 15,
        lineHeight: 1.5,
      }}
    >
      <strong>Let op</strong>
      <div style={{ marginTop: 4 }}>
        Deze gids is in november 2026 samengesteld uit openbare bronnen. Openingstijden, prijzen, evenementen en metro-informatie kunnen wijzigen. Het aantal haltes vanaf het hotel is afgeleid uit het metroschema en niet ter plekke gecontroleerd. Check bij twijfel Google Maps of Citymapper en de website van de plek zelf.
      </div>
    </div>
  );
}

// ─── TAB: HIGHLIGHTS ────────────────────────────────────────────────────────
function Highlights() {
  const [actief, setActief] = useState("alles");
  const zichtbaar = actief === "alles" ? WIJKEN : WIJKEN.filter((w) => w.id === actief);

  return (
    <div style={{ padding: "16px 16px 24px" }}>
      <div style={{ display: "flex", gap: 8, overflowX: "auto", paddingBottom: 12 }}>
        {[{ id: "alles", kort: "Alles" }, ...WIJKEN].map((w) => {
          const aan = actief === w.id;
          return (
            <button
              key={w.id}
              onClick={() => setActief(w.id)}
              style={{
                flexShrink: 0,
                padding: "9px 14px",
                fontSize: 15,
                fontWeight: aan ? 700 : 500,
                fontFamily: sans,
                borderRadius: 20,
                border: `1.5px solid ${aan ? T.accentBg : T.line}`,
                background: aan ? T.accentBg : T.card,
                color: aan ? "#fff" : T.ink,
                cursor: "pointer",
              }}
            >
              {w.kort}
            </button>
          );
        })}
      </div>

      {zichtbaar.map((w) => (
        <section key={w.id} style={{ marginTop: 20 }}>
          <h2 style={{ fontFamily: serif, fontSize: 24, fontWeight: 700, margin: 0, color: T.ink }}>{w.naam}</h2>
          <p style={{ margin: "4px 0 10px", fontSize: 15, color: T.dim }}>{w.sub}</p>
          <div
            style={{
              background: T.soft,
              color: T.softInk,
              borderRadius: 8,
              padding: "10px 12px",
              fontSize: 15,
              lineHeight: 1.45,
              marginBottom: 12,
            }}
          >
            <strong>Vanaf het hotel:</strong> {w.vanHotel}
          </div>

          <div style={{ display: "grid", gap: 14 }}>
            {w.items.map((it) => (
              <article key={it.id} style={kaartStijl}>
                <div style={{ padding: 14 }}>
                  <h3 style={{ fontFamily: serif, fontSize: 20, margin: 0, lineHeight: 1.25, color: T.ink }}>{it.titel}</h3>
                  {it.tags.length > 0 && (
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 10 }}>
                      {it.tags.map((t) => (
                        <Tag key={t.t} {...t} />
                      ))}
                    </div>
                  )}
                  <p style={{ margin: "10px 0 0", fontSize: 16, lineHeight: 1.55, color: T.ink }}>{it.tekst}</p>
                  {it.extra && <p style={{ margin: "8px 0 0", fontSize: 15, lineHeight: 1.5, color: T.dim }}>{it.extra}</p>}
                  <MetroRegels metro={it.metro} />
                  <div style={{ display: "flex", gap: 10, marginTop: 14 }}>
                    <Knop href={fotos(it.foto)}>Foto’s bekijken</Knop>
                    <Knop href={kaart(it.plek)}>Route</Knop>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}

// ─── TAB: RESTAURANTS ───────────────────────────────────────────────────────
function Restaurants() {
  const gereserveerd = RESTAURANTS.filter((r) => r.status === "gereserveerd");
  const mogelijk = RESTAURANTS.filter((r) => r.status === "mogelijk");

  const Kaart = ({ r }) => (
    <article style={kaartStijl}>
      <div style={{ display: "flex", borderBottom: `1px solid ${T.line}` }}>
        <div
          style={{
            background: r.status === "gereserveerd" ? T.accentBg : T.amberSoft,
            color: r.status === "gereserveerd" ? "#fff" : T.amber,
            padding: "12px 14px",
            minWidth: 108,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          <div style={{ fontSize: 15, fontWeight: 700, lineHeight: 1.25 }}>{r.dag}</div>
          {r.tijd && <div style={{ fontFamily: serif, fontSize: 26, fontWeight: 700, lineHeight: 1.1 }}>{r.tijd}</div>}
        </div>
        <div style={{ padding: "12px 14px" }}>
          <h3 style={{ fontFamily: serif, fontSize: 22, margin: 0, color: T.ink }}>{r.naam}</h3>
          {r.soort && <div style={{ fontSize: 15, color: T.dim, marginTop: 2 }}>{r.soort}</div>}
        </div>
      </div>
      <div style={{ padding: 14 }}>
        {r.tags && r.tags.length > 0 && (
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 10 }}>
            {r.tags.map((t) => (
              <Tag key={t.t} {...t} />
            ))}
          </div>
        )}
        {r.adres && <div style={{ fontSize: 16, color: T.ink, marginBottom: 8 }}>{r.adres}</div>}
        <p style={{ margin: 0, fontSize: 16, lineHeight: 1.55, color: T.ink }}>{r.tekst}</p>
        {r.extra && <p style={{ margin: "8px 0 0", fontSize: 15, lineHeight: 1.5, color: T.dim }}>{r.extra}</p>}
        <MetroRegels metro={r.metro} />
        {r.adres && (
          <div style={{ display: "flex", gap: 10, marginTop: 14 }}>
            <Knop href={kaart(r.plek)}>Route</Knop>
          </div>
        )}
      </div>
    </article>
  );

  return (
    <div style={{ padding: "16px 16px 24px" }}>
      <h2 style={{ fontFamily: serif, fontSize: 24, margin: "4px 0 12px", color: T.ink }}>Gereserveerd</h2>
      <div style={{ display: "grid", gap: 14 }}>
        {gereserveerd.map((r) => (
          <Kaart key={r.id} r={r} />
        ))}
      </div>
      <h2 style={{ fontFamily: serif, fontSize: 24, margin: "28px 0 12px", color: T.ink }}>Mogelijk</h2>
      <div style={{ display: "grid", gap: 14 }}>
        {mogelijk.map((r) => (
          <Kaart key={r.id} r={r} />
        ))}
      </div>
    </div>
  );
}

// ─── TAB: HOTEL ─────────────────────────────────────────────────────────────
function Hotel() {
  const rij = (label, waarde) => (
    <div style={{ display: "flex", gap: 12, padding: "10px 0", borderBottom: `1px solid ${T.line}` }}>
      <div style={{ width: 96, flexShrink: 0, fontSize: 15, color: T.dim }}>{label}</div>
      <div style={{ fontSize: 16, color: T.ink, lineHeight: 1.45 }}>{waarde}</div>
    </div>
  );

  return (
    <div style={{ padding: "16px 16px 24px" }}>
      <article style={kaartStijl}>
        <div style={{ padding: 14 }}>
          <h2 style={{ fontFamily: serif, fontSize: 26, margin: 0, color: T.ink }}>Hôtel Modern’Est</h2>
          <div style={{ fontSize: 16, color: T.dim, marginTop: 2 }}>2 sterren, 10e arrondissement</div>
          <div style={{ marginTop: 10 }}>
            <Tag t="Gereserveerd" k="ok" />
          </div>

          <div style={{ marginTop: 10 }}>
            {rij("Verblijf", "dinsdag 24 t/m vrijdag 27 november (3 nachten)")}
            {rij("Adres", "91 boulevard de Strasbourg, 75010 Paris")}
            {rij("Telefoon", <a href="tel:+33140377720" style={{ color: T.accent, fontWeight: 600 }}>+33 1 40 37 77 20</a>)}
            {rij("Inchecken", "dinsdag 24 november, vanaf 14:00")}
            {rij("Uitchecken", "vrijdag 27 november, tot 12:00 (controleer in je bevestiging)")}
            {rij("Ontbijt", "beschikbaar tegen bijbetaling")}
          </div>

          <div style={{ fontSize: 14, fontWeight: 700, color: T.dim, margin: "16px 0 0" }}>Metro bij het hotel</div>
          <MetroRegels
            metro={[
              { station: "Gare de l’Est (vlak bij de deur)", lijnen: ["4", "5", "7"] },
              { station: "Château d’Eau", lijnen: ["4"] },
              { station: "Jacques Bonsergent", lijnen: ["5"] },
            ]}
          />
          <p style={{ margin: "12px 0 0", fontSize: 15, lineHeight: 1.5, color: T.dim }}>
            Gare de l’Est ligt tegenover het hotel. Gare du Nord (internationale treinen, RER B naar Charles de Gaulle) is ongeveer 10 minuten lopen. Het Canal Saint-Martin is 4 minuten lopen.
          </p>

          <div style={{ display: "flex", gap: 10, marginTop: 14 }}>
            <Knop href={kaart("Hôtel Modern’Est, 91 boulevard de Strasbourg, 75010 Paris")}>Route</Knop>
            <Knop href={fotos("Hotel Modern’Est Paris boulevard de Strasbourg")}>Foto’s bekijken</Knop>
          </div>
        </div>
      </article>

      <h2 style={{ fontFamily: serif, fontSize: 22, margin: "28px 0 4px", color: T.ink }}>Vanaf het hotel naar...</h2>
      <p style={{ margin: "0 0 12px", fontSize: 15, color: T.dim }}>
        Het aantal haltes is afgeleid uit het metroschema (zie “Let op” onderaan).
      </p>
      <div style={{ ...kaartStijl }}>
        {WIJKEN.map((w, i) => (
          <div key={w.id} style={{ padding: "12px 14px", borderTop: i === 0 ? "none" : `1px solid ${T.line}` }}>
            <div style={{ fontSize: 16, fontWeight: 700, color: T.ink }}>{w.naam}</div>
            <div style={{ fontSize: 15, color: T.dim, marginTop: 2, lineHeight: 1.45 }}>{w.vanHotel}</div>
          </div>
        ))}
        <div style={{ padding: "12px 14px", borderTop: `1px solid ${T.line}` }}>
          <div style={{ fontSize: 16, fontWeight: 700, color: T.ink }}>Le Parisien</div>
          <div style={{ fontSize: 15, color: T.dim, marginTop: 2 }}>Dichtbij, te voet.</div>
        </div>
        <div style={{ padding: "12px 14px", borderTop: `1px solid ${T.line}` }}>
          <div style={{ fontSize: 16, fontWeight: 700, color: T.ink }}>Libertino</div>
          <div style={{ fontSize: 15, color: T.dim, marginTop: 2 }}>Dichtbij, te voet.</div>
        </div>
        <div style={{ padding: "12px 14px", borderTop: `1px solid ${T.line}` }}>
          <div style={{ fontSize: 16, fontWeight: 700, color: T.ink }}>Bouillon Chartier</div>
          <div style={{ fontSize: 15, color: T.dim, marginTop: 2 }}>Tegenover Gare de l’Est, te voet.</div>
        </div>
        <div style={{ padding: "12px 14px", borderTop: `1px solid ${T.line}` }}>
          <div style={{ fontSize: 16, fontWeight: 700, color: T.ink }}>Le Cornichon</div>
          <div style={{ fontSize: 15, color: T.dim, marginTop: 2 }}>Lijn 4 rechtstreeks naar Denfert-Rochereau.</div>
        </div>
      </div>
    </div>
  );
}

// ─── APP ────────────────────────────────────────────────────────────────────
const TAB_IDS = ["highlights", "restaurants", "hotel"];
const tabUitHash = () => {
  try {
    const h = window.location.hash.replace("#", "");
    return TAB_IDS.includes(h) ? h : "highlights";
  } catch (e) {
    return "highlights";
  }
};

export default function App() {
  const [tab, setTabState] = useState(tabUitHash);
  useEffect(() => {
    const opHash = () => setTabState(tabUitHash());
    window.addEventListener("hashchange", opHash);
    return () => window.removeEventListener("hashchange", opHash);
  }, []);
  const setTab = (id) => {
    setTabState(id);
    try {
      window.location.hash = id;
      window.scrollTo(0, 0);
    } catch (e) {
      /* hash niet beschikbaar: tab wisselt toch */
    }
  };
  const TABS = [
    { id: "highlights", label: "Highlights" },
    { id: "restaurants", label: "Restaurants" },
    { id: "hotel", label: "Hotel" },
  ];

  return (
    <div
      style={{
        background: T.bg,
        minHeight: "100vh",
        maxWidth: 520,
        margin: "0 auto",
        display: "flex",
        flexDirection: "column",
        fontFamily: sans,
        color: T.ink,
      }}
    >
      <style>{THEME_CSS}</style>
      <header style={{ background: T.accentBg, color: "#fff", padding: "calc(16px + env(safe-area-inset-top, 0px)) 16px 14px" }}>
        <div style={{ fontFamily: serif, fontSize: 28, fontWeight: 700, lineHeight: 1.1 }}>Parijs</div>
        <div style={{ fontSize: 15, opacity: 0.85, marginTop: 2 }}>24 t/m 27 november 2026</div>
      </header>

      <main style={{ flex: 1 }}>
        {tab === "highlights" && <Highlights />}
        {tab === "restaurants" && <Restaurants />}
        {tab === "hotel" && <Hotel />}
        <LetOp />
        <div style={{ height: 24 }} />
      </main>

      <nav
        style={{
          position: "sticky",
          bottom: 0,
          display: "flex",
          background: T.card,
          borderTop: `1px solid ${T.line}`,
          paddingBottom: "env(safe-area-inset-bottom)",
        }}
      >
        {TABS.map((t) => {
          const aan = tab === t.id;
          return (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              style={{
                flex: 1,
                padding: "15px 0",
                fontSize: 16,
                fontWeight: aan ? 700 : 500,
                fontFamily: sans,
                border: "none",
                borderTop: `3px solid ${aan ? T.accent : "transparent"}`,
                background: "none",
                color: aan ? T.accent : T.dim,
                cursor: "pointer",
              }}
            >
              {t.label}
            </button>
          );
        })}
      </nav>
    </div>
  );
}
