import { db } from '../src/db'
import {
  players,
  economicEvents,
  macroIndicators,
  indicatorDataPoints,
  relationships,
  eventPlayers,
} from './schema'
import { logger } from '../src/utils/logger'

// ─── PLAYERS ────────────────────────────────────────────────────────────────

const PLAYERS = [
  // ── REGULATORS & GOVERNMENT ─────────────────────────────────────────────
  {
    id: 'player-cbk',
    slug: 'central-bank-kenya',
    name: 'Central Bank of Kenya',
    sector: 'REGULATION' as const,
    type: 'REGULATOR' as const,
    subtype: 'Central Bank',
    founded: 1966,
    hq: 'Nairobi',
    ownership: 'Government of Kenya (100%)',
    description:
      'Kenya\'s monetary authority responsible for formulating and implementing monetary policy, issuing currency, and regulating the banking sector. The CBK sets the Central Bank Rate (CBR) which anchors all lending rates. It holds and manages Kenya\'s foreign exchange reserves and oversees all commercial banks, microfinance institutions, and payment system operators including M-Pesa. The CBK Governor is one of the most consequential economic appointments in Kenya.',
    keyFacts: [
      'Sets the Central Bank Rate (CBR) — currently at 10.75% after cutting cycle began mid-2024',
      'Holds ~$7.3B in forex reserves (~4 months import cover)',
      'Regulates 38 commercial banks, 14 microfinance banks, and 9 deposit-taking SACCOs',
      'Oversees National Payment System including M-Pesa under the NPS Act',
      'Issues Kenya Shilling — manages USD/KES exchange rate stability',
      'Publishes weekly bulletin with T-bill rates, M-Pesa stats, and FX data',
    ],
    tags: ['regulator', 'monetary-policy', 'banking-supervisor', 'government'],
    riskLevel: 'LOW' as const,
  },
  {
    id: 'player-cma',
    slug: 'capital-markets-authority',
    name: 'Capital Markets Authority (CMA)',
    sector: 'REGULATION' as const,
    type: 'REGULATOR' as const,
    subtype: 'Securities Regulator',
    founded: 1990,
    hq: 'Nairobi',
    ownership: 'Government of Kenya (100%)',
    description:
      'Regulates and develops Kenya\'s capital markets including the Nairobi Securities Exchange, investment banks, fund managers, collective investment schemes, and REITs. The CMA approves IPOs, bond issuances, and takeovers. Has been actively pushing for more listings, a deeper corporate bond market, and a REIT framework to mobilise real estate investment.',
    keyFacts: [
      'Approved Kenya\'s first green bond (Acorn Holdings, KES 4.3B, 2019)',
      'Regulates ~65 NSE listed securities',
      'Pushing REITs framework — Acorn D-REIT was first in East Africa',
      'Oversees collective investment schemes with AUM of ~KES 180B',
    ],
    tags: ['regulator', 'capital-markets', 'nse', 'government'],
    riskLevel: 'LOW' as const,
  },
  {
    id: 'player-kra',
    slug: 'kenya-revenue-authority',
    name: 'Kenya Revenue Authority (KRA)',
    sector: 'GOVERNMENT' as const,
    type: 'GOVERNMENT_AGENCY' as const,
    subtype: 'Tax Authority',
    founded: 1995,
    hq: 'Nairobi',
    ownership: 'Government of Kenya (100%)',
    revenue: 'Collected KES 2.16T (FY2023/24)',
    description:
      'National tax collection agency responsible for collecting VAT, corporate tax, PAYE, excise duties, and customs. Has been under intense pressure to meet ambitious revenue targets set by National Treasury. Rolling out eTIMS (electronic tax invoice management system) to seal VAT leakage. Customs revenue is heavily tied to Mombasa Port throughput.',
    keyFacts: [
      'FY2023/24 target was KES 2.57T — missed by ~KES 410B',
      'eTIMS electronic invoicing rollout targeting all VAT-registered businesses',
      'Customs & Border Control is single largest revenue stream',
      'iTax system handles all individual and corporate filings',
      'Largest single taxpayer is Safaricom PLC',
    ],
    tags: ['government', 'tax', 'revenue', 'customs'],
    riskLevel: 'LOW' as const,
  },
  {
    id: 'player-ca',
    slug: 'communications-authority',
    name: 'Communications Authority of Kenya (CA)',
    sector: 'REGULATION' as const,
    type: 'REGULATOR' as const,
    subtype: 'Telecoms & Broadcasting Regulator',
    founded: 1999,
    hq: 'Nairobi',
    ownership: 'Government of Kenya (100%)',
    description:
      'Regulates telecommunications, broadcasting, postal, and courier sectors in Kenya. Issues spectrum licenses and type approval for devices. Blocked the proposed Airtel Kenya–Telkom Kenya merger in 2019 on competition grounds. Sets interconnection rates between operators which significantly impacts telco economics.',
    keyFacts: [
      'Blocked Airtel-Telkom merger in 2019 — referred to Competition Authority',
      'Issues spectrum licenses including 5G allocations',
      'Sets mobile termination rates — Safaricom pays lower rates than rivals',
      'Mandated M-Pesa interoperability with other mobile money platforms',
    ],
    tags: ['regulator', 'telecoms', 'broadcasting', 'government'],
    riskLevel: 'LOW' as const,
  },
  {
    id: 'player-cak',
    slug: 'competition-authority-kenya',
    name: 'Competition Authority of Kenya (CAK)',
    sector: 'REGULATION' as const,
    type: 'REGULATOR' as const,
    subtype: 'Competition Regulator',
    founded: 2010,
    hq: 'Nairobi',
    ownership: 'Government of Kenya (100%)',
    description:
      'Enforces competition law, reviews mergers and acquisitions, and investigates anti-competitive practices. Blocked the Airtel-Telkom merger. Has been increasingly active in reviewing digital market dominance, particularly Safaricom\'s M-Pesa market share.',
    keyFacts: [
      'Blocked Airtel-Telkom merger in 2019',
      'Investigating Safaricom dominance in mobile money',
      'Reviews all mergers above KES 1B threshold',
    ],
    tags: ['regulator', 'competition', 'mergers', 'government'],
    riskLevel: 'LOW' as const,
  },
  {
    id: 'player-treasury',
    slug: 'national-treasury',
    name: 'National Treasury & Economic Planning',
    sector: 'GOVERNMENT' as const,
    type: 'MINISTRY' as const,
    subtype: 'Ministry of Finance',
    founded: 1963,
    hq: 'Nairobi',
    ownership: 'Government of Kenya (100%)',
    description:
      'Kenya\'s finance ministry responsible for fiscal policy, budget preparation, public debt management, and economic planning. Manages Kenya\'s relationship with the IMF, World Bank, and bilateral creditors. The Cabinet Secretary for Treasury is the second most powerful economic position after the CBK Governor. Controls all SOE oversight and sets revenue targets for KRA.',
    keyFacts: [
      'Manages public debt of ~KES 10.6T (~68% of GDP)',
      'Annual budget ~KES 3.9T (FY2024/25)',
      'IMF program (ECF) provides ~$2.34B in support',
      'Eurobond of $2B repaid February 2024 — major debt management milestone',
      'Oversees all State-Owned Enterprises via State Department',
    ],
    tags: ['government', 'fiscal-policy', 'debt-management', 'budget'],
    riskLevel: 'LOW' as const,
  },
  {
    id: 'player-nse',
    slug: 'nairobi-securities-exchange',
    name: 'Nairobi Securities Exchange (NSE)',
    sector: 'REGULATION' as const,
    type: 'LISTED_COMPANY' as const,
    subtype: 'Stock Exchange',
    founded: 1954,
    hq: 'Nairobi',
    ownership: 'Public (NSE self-listed), CMA oversight',
    marketCap: 'KES 2.1B (NSE itself)',
    description:
      'Kenya\'s primary securities exchange. Hosts equity, debt, and derivatives markets. Self-listed since 2014. The NSE 20 Share Index and NSE All-Share Index (NASI) are the main benchmarks. Equity and Safaricom dominate by market cap and trading volume. Has been working on derivatives and commodities exchange products.',
    keyFacts: [
      '65+ listed securities across equities, bonds, and ETFs',
      'Safaricom is the largest listed company (~40% of NSE total market cap)',
      'Self-listed in 2014 — one of few exchanges globally to list itself',
      'NSE 20 Index declined significantly in 2023 due to macro pressures',
      'M-Akiba retail government bond platform launched via NSE',
    ],
    tags: ['exchange', 'capital-markets', 'equities', 'bonds'],
    riskLevel: 'LOW' as const,
  },

  // ── TIER 1 BANKS ─────────────────────────────────────────────────────────
  {
    id: 'player-kcb',
    slug: 'kcb-group',
    name: 'KCB Group PLC',
    sector: 'BANKING' as const,
    type: 'LISTED_COMPANY' as const,
    subtype: 'Tier 1 Bank',
    founded: 1896,
    hq: 'Nairobi',
    ownership: 'Public (NSE/LSE listed), Government of Kenya ~17.53%',
    revenue: 'KES 145B (2023)',
    employees: '~6,500',
    marketCap: 'KES 55B',
    description:
      'Largest bank by assets in East Africa with total assets of ~KES 1.9T. Operates in Kenya, Uganda, Tanzania, Rwanda, Burundi, Ethiopia, and DRC. Acquired National Bank of Kenya in 2019 and TMB (Democratic Republic of Congo) in 2020. KCB M-Pesa is a major mobile lending product in JV with Safaricom. The Government of Kenya is a significant shareholder and KCB is a primary banker to the government.',
    keyFacts: [
      'Largest bank by assets in East Africa — KES 1.9T total assets',
      'Acquired National Bank of Kenya (NBK) in 2019 after near-collapse',
      'KCB M-Pesa mobile loan product has 20M+ registered accounts',
      'GoK owns ~17.53% — primary government banker',
      'Operations in 7 African countries',
      'Issued KES 10B green bond in 2023',
    ],
    tags: ['bank', 'tier1', 'nse', 'eastafrica', 'government-linked'],
    riskLevel: 'LOW' as const,
  },
  {
    id: 'player-equity',
    slug: 'equity-group',
    name: 'Equity Group Holdings PLC',
    sector: 'BANKING' as const,
    type: 'LISTED_COMPANY' as const,
    subtype: 'Tier 1 Bank',
    founded: 1984,
    hq: 'Nairobi',
    ownership: 'Public (NSE listed), Helios Investment Partners ~9%, British International Investment ~7%',
    revenue: 'KES 163B (2023)',
    employees: '~9,000',
    marketCap: 'KES 72B',
    description:
      'Started as Equity Building Society serving low-income Kenyans in Murang\'a. Now the largest bank in Africa by customer count with ~20 million accounts. Operates in Kenya, Uganda, Tanzania, Rwanda, DRC (via Equity BCDC), South Sudan, and Ethiopia. Equity BCDC (formerly BCDC) in DRC is a major acquisition providing significant revenue diversification. The bank\'s inclusive finance model targeting unbanked populations became a globally recognised case study.',
    keyFacts: [
      '20M+ customers — largest bank in Africa by customer count',
      'Equity BCDC (DRC) acquisition gives massive Central Africa exposure',
      'Wings to Fly scholarship — ~500,000 students funded since 2012',
      'British International Investment (UK DFI) is key shareholder',
      'Equitel MVNO — mobile banking integrated with telco SIM',
      'Total assets ~KES 1.7T',
    ],
    tags: ['bank', 'tier1', 'nse', 'eastafrica', 'inclusive-finance', 'drc'],
    riskLevel: 'LOW' as const,
  },
  {
    id: 'player-cooperative',
    slug: 'cooperative-bank',
    name: 'Co-operative Bank of Kenya',
    sector: 'BANKING' as const,
    type: 'LISTED_COMPANY' as const,
    subtype: 'Tier 1 Bank',
    founded: 1965,
    hq: 'Nairobi',
    ownership: 'Co-operative Movement (Co-op Holdings) ~64.56%, Public ~35.44% (NSE listed)',
    revenue: 'KES 82B (2023)',
    employees: '~5,200',
    marketCap: 'KES 28B',
    description:
      'Third-largest bank by assets in Kenya. Uniquely owned by the co-operative movement — Kenya\'s tea, coffee, dairy, and horticultural SACCOs collectively own majority stake through Co-op Holdings. This gives it deep roots in agricultural communities. Key financier for the tea and coffee sectors, and primary banker for many SACCOs. Also operates in South Sudan.',
    keyFacts: [
      'Co-operative movement owns ~64.56% via Co-op Holdings',
      'Primary banker for Kenya\'s tea, coffee, and dairy SACCO networks',
      'MCo-opCash mobile banking platform has ~8M users',
      'Key financier of agricultural value chains',
      'Total assets ~KES 700B',
    ],
    tags: ['bank', 'tier1', 'nse', 'agriculture', 'cooperatives', 'saccos'],
    riskLevel: 'LOW' as const,
  },
  {
    id: 'player-ncba',
    slug: 'ncba-group',
    name: 'NCBA Group PLC',
    sector: 'BANKING' as const,
    type: 'LISTED_COMPANY' as const,
    subtype: 'Tier 1 Bank',
    founded: 2019,
    hq: 'Nairobi',
    ownership: 'Public (NSE listed), Kenyatta family interests ~26%, Merali family ~8%',
    revenue: 'KES 48B (2023)',
    employees: '~3,500',
    marketCap: 'KES 22B',
    description:
      'Formed in 2019 through the merger of NIC Group and Commercial Bank of Africa (CBA). CBA was privately held by the Kenyatta and Merali families and was the original partner behind M-Shwari with Safaricom. The merger created a major Tier 1 bank. M-Shwari (NCBA/Safaricom JV) is the largest digital savings and lending product in Kenya with 30M+ accounts.',
    keyFacts: [
      'Formed 2019 via NIC Group + Commercial Bank of Africa merger',
      'M-Shwari (JV with Safaricom) has 30M+ accounts — dominant digital lending',
      'Kenyatta family interests are significant shareholders',
      'Loop digital banking platform targets youth market',
      'Strong in asset finance and corporate banking',
    ],
    tags: ['bank', 'tier1', 'nse', 'fintech', 'kenyatta-family', 'mshwari'],
    riskLevel: 'LOW' as const,
  },
  {
    id: 'player-absa',
    slug: 'absa-bank-kenya',
    name: 'Absa Bank Kenya PLC',
    sector: 'BANKING' as const,
    type: 'LISTED_COMPANY' as const,
    subtype: 'Tier 1 Bank',
    founded: 1916,
    hq: 'Nairobi',
    ownership: 'Absa Group (South Africa) ~68.5%, Public ~31.5% (NSE listed)',
    revenue: 'KES 34B (2023)',
    employees: '~3,000',
    marketCap: 'KES 16B',
    description:
      'Formerly Barclays Bank of Kenya — rebranded to Absa in 2020 following Barclays PLC selling its African operations to Absa Group. Strong in retail banking, mortgage finance, and trade finance. Part of the pan-African Absa Group which also operates in 12 other African countries. Retains strong corporate client base from legacy Barclays relationships.',
    keyFacts: [
      'Rebranded from Barclays Bank of Kenya to Absa in 2020',
      'Absa Group (South Africa) holds ~68.5%',
      'Strong legacy corporate and institutional banking franchise',
      'KES 100B+ mortgage book — one of largest in Kenya',
      'Trade finance specialist for import/export clients',
    ],
    tags: ['bank', 'tier1', 'nse', 'foreign', 'southafrica', 'formerly-barclays'],
    riskLevel: 'LOW' as const,
  },
  {
    id: 'player-stanchart',
    slug: 'standard-chartered-kenya',
    name: 'Standard Chartered Bank Kenya PLC',
    sector: 'BANKING' as const,
    type: 'LISTED_COMPANY' as const,
    subtype: 'Tier 1 Bank',
    founded: 1911,
    hq: 'Nairobi',
    ownership: 'Standard Chartered PLC (UK) ~74.67%, Public ~25.33% (NSE listed)',
    revenue: 'KES 25B (2023)',
    employees: '~1,800',
    marketCap: 'KES 23B',
    description:
      'Oldest bank in Kenya. Part of Standard Chartered PLC, a major global bank. Focuses on corporate, institutional, and high-net-worth clients. Significant player in foreign currency transactions, trade finance, and correspondent banking. Known for the highest margins in Kenya\'s banking sector due to premium client focus.',
    keyFacts: [
      'Oldest bank in Kenya, established 1911',
      'StanChart PLC (UK) holds ~74.67%',
      'Highest net interest margin among Kenya\'s major banks',
      'Dominant in FX trading and correspondent banking',
      'Pivoting away from mass retail toward wealth and corporate',
    ],
    tags: ['bank', 'tier1', 'nse', 'foreign', 'uk', 'corporate-banking'],
    riskLevel: 'LOW' as const,
  },

  // ── TIER 2 BANKS ─────────────────────────────────────────────────────────
  {
    id: 'player-dtb',
    slug: 'diamond-trust-bank',
    name: 'Diamond Trust Bank (DTB) Group',
    sector: 'BANKING' as const,
    type: 'LISTED_COMPANY' as const,
    subtype: 'Tier 2 Bank',
    founded: 1946,
    hq: 'Nairobi',
    ownership: 'Aga Khan Fund for Economic Development (AKFED) ~42.5%, Public (NSE listed)',
    revenue: 'KES 28B (2023)',
    employees: '~2,500',
    marketCap: 'KES 9B',
    description:
      'Mid-tier bank with deep roots in East Africa\'s Asian business community. Part of the Aga Khan Development Network (AKDN). Operates in Kenya, Uganda, Tanzania, and Burundi. Significant in trade finance for SMEs. The Aga Khan\'s AKFED is the controlling shareholder alongside the broader AKDN ecosystem which includes Jubilee Insurance and various infrastructure investments.',
    keyFacts: [
      'AKFED (Aga Khan Fund) holds ~42.5% — part of AKDN ecosystem',
      'Operates in Kenya, Uganda, Tanzania, Burundi',
      'SME and trade finance specialist',
      'Connected to Jubilee Insurance and other AKDN entities in Kenya',
    ],
    tags: ['bank', 'tier2', 'nse', 'akdn', 'aga-khan', 'trade-finance'],
    riskLevel: 'LOW' as const,
  },
  {
    id: 'player-im-bank',
    slug: 'im-group',
    name: 'I&M Group PLC',
    sector: 'BANKING' as const,
    type: 'LISTED_COMPANY' as const,
    subtype: 'Tier 2 Bank',
    founded: 1974,
    hq: 'Nairobi',
    ownership: 'British International Investment (BII) ~9.97%, Public (NSE listed)',
    revenue: 'KES 24B (2023)',
    employees: '~2,200',
    marketCap: 'KES 11B',
    description:
      'Mid-tier bank with strong roots in Kenya\'s Asian business community. Regional presence in Rwanda, Tanzania, Uganda, and Mauritius. British International Investment (formerly CDC Group, the UK\'s development finance institution) is a significant shareholder. Acquired Bank One in Mauritius, expanding into Indian Ocean market. Strong in trade finance and SME banking.',
    keyFacts: [
      'BII (UK development finance institution) is key shareholder',
      'Acquired Bank One (Mauritius) — Indian Ocean expansion',
      'Regional in Rwanda, Tanzania, Uganda, Mauritius',
      'Strong in trade finance for Asian business community',
    ],
    tags: ['bank', 'tier2', 'nse', 'foreign', 'bii', 'regional'],
    riskLevel: 'LOW' as const,
  },
  {
    id: 'player-stanbic',
    slug: 'stanbic-bank-kenya',
    name: 'Stanbic Bank Kenya',
    sector: 'BANKING' as const,
    type: 'SUBSIDIARY' as const,
    subtype: 'Tier 2 Bank',
    founded: 1992,
    hq: 'Nairobi',
    ownership: 'Standard Bank Group (South Africa) ~100%',
    revenue: 'KES 18B (2023)',
    employees: '~1,500',
    description:
      'Kenyan subsidiary of Standard Bank Group, Africa\'s largest bank by assets. Focuses on corporate and investment banking (CIB), trade finance for multinationals, and structured finance. Significant in infrastructure and project finance deals. Part of the broader Standard Bank/ICBC (Industrial and Commercial Bank of China) global network.',
    keyFacts: [
      'Standard Bank Group (South Africa) is 100% owner',
      'Standard Bank is Africa\'s largest bank by assets',
      'Dominant in corporate and investment banking (CIB)',
      'Key financier for infrastructure projects in Kenya',
      'Connected to ICBC network via Standard Bank\'s Chinese partnership',
    ],
    tags: ['bank', 'tier2', 'foreign', 'southafrica', 'cib', 'infrastructure'],
    riskLevel: 'LOW' as const,
  },
  {
    id: 'player-family-bank',
    slug: 'family-bank',
    name: 'Family Bank Kenya',
    sector: 'BANKING' as const,
    type: 'LISTED_COMPANY' as const,
    subtype: 'Tier 2 Bank',
    founded: 1984,
    hq: 'Nairobi',
    ownership: 'Public (NSE listed), various institutional shareholders',
    revenue: 'KES 11B (2023)',
    employees: '~2,000',
    marketCap: 'KES 4B',
    description:
      'Mid-tier bank targeting retail, SME, and agricultural customers. Formerly Family Finance Building Society before converting to a full bank. Strong in SME lending and agribusiness finance. Has been expanding its digital banking footprint via Paybill and mobile banking.',
    keyFacts: [
      'Converted from Family Finance Building Society in 2007',
      'Strong in SME and agribusiness lending',
      'Significant presence in rural Kenya via agency banking',
    ],
    tags: ['bank', 'tier2', 'nse', 'sme', 'agribusiness'],
    riskLevel: 'MEDIUM' as const,
  },
  {
    id: 'player-nbk',
    slug: 'national-bank-kenya',
    name: 'National Bank of Kenya (NBK)',
    sector: 'BANKING' as const,
    type: 'SUBSIDIARY' as const,
    subtype: 'Tier 2 Bank',
    founded: 1968,
    hq: 'Nairobi',
    ownership: 'KCB Group (100%)',
    revenue: 'KES 12B (2023)',
    employees: '~1,200',
    description:
      'Formerly a government-owned bank, nearly collapsed in the late 2010s due to bad loans and governance failures. The government orchestrated a takeover by KCB Group in 2019. Now operates as a KCB subsidiary targeting government workers and civil servants. The NBK saga is one of Kenya\'s most significant banking sector governance failures.',
    keyFacts: [
      'Acquired by KCB Group in 2019 after near-insolvency',
      'Was nearly insolvent — massive NPL problem before acquisition',
      'Historically served government workers and civil servants',
      'Now being integrated into KCB Group operations',
    ],
    tags: ['bank', 'tier2', 'subsidiary', 'kcb', 'formerly-government'],
    riskLevel: 'LOW' as const,
  },
  {
    id: 'player-hf-group',
    slug: 'hf-group',
    name: 'HF Group PLC',
    sector: 'BANKING' as const,
    type: 'LISTED_COMPANY' as const,
    subtype: 'Tier 3 Bank',
    founded: 1965,
    hq: 'Nairobi',
    ownership: 'Public (NSE listed), Equity Group ~24.99%',
    revenue: 'KES 5B (2023)',
    employees: '~800',
    marketCap: 'KES 1.5B',
    description:
      'Formerly Housing Finance Company — Kenya\'s original mortgage specialist. Pivoting into full-service banking. Equity Group is a significant shareholder (~25%). Has been loss-making and struggling to compete in the changed mortgage market where commercial banks have taken over. The HF saga illustrates challenges of niche banks pivoting to full-service models.',
    keyFacts: [
      'Formerly Housing Finance Company — oldest mortgage lender in Kenya',
      'Equity Group holds ~24.99% stake',
      'Struggling with legacy mortgage NPLs and business model pivot',
      'Loss-making in recent years',
    ],
    tags: ['bank', 'tier3', 'nse', 'mortgage', 'struggling'],
    riskLevel: 'HIGH' as const,
  },

  // ── TELCOS ───────────────────────────────────────────────────────────────
  {
    id: 'player-safaricom',
    slug: 'safaricom-plc',
    name: 'Safaricom PLC',
    sector: 'TELECOMMUNICATIONS' as const,
    type: 'LISTED_COMPANY' as const,
    subtype: 'Dominant Telco',
    founded: 2000,
    hq: 'Nairobi',
    ownership: 'Vodacom Group ~34.94%, Vodafone ~5%, GoK ~35.2%, Public ~24.86% (NSE listed)',
    revenue: 'KES 308B (FY2023)',
    employees: '~6,000',
    marketCap: 'KES 430B',
    description:
      'Kenya\'s largest company by market capitalisation and revenue. Operates M-Pesa, Africa\'s largest and most profitable mobile money platform. M-Pesa processes transactions equivalent to ~50% of Kenya\'s GDP annually. Launched Ethiopian operations in 2022 — the largest telecom market entry in African history. Also operates in Ethiopia via a 15-year license won in consortium with Vodacom, Vodafone, and CDC. Safaricom is the largest single taxpayer in Kenya and dominates telecom, mobile money, and increasingly enterprise IT.',
    keyFacts: [
      'M-Pesa processes ~KES 33T annually — ~50% of Kenya\'s GDP',
      'Ethiopia launch 2022 — $850M license, 15-year term, 120M+ population market',
      'Largest taxpayer in Kenya — contributes ~7% of total KRA revenue',
      'Dominant market shares: voice ~65%, data ~65%, mobile money ~97%',
      'Fuliza overdraft product has 44M+ registered users',
      'NSE most traded stock by value',
      'Vodacom (SA) and Vodafone (UK) are strategic shareholders',
    ],
    tags: ['telco', 'fintech', 'nse', 'mpesa', 'ethiopia', 'dominant', 'government-linked'],
    riskLevel: 'LOW' as const,
  },
  {
    id: 'player-airtel',
    slug: 'airtel-kenya',
    name: 'Airtel Kenya',
    sector: 'TELECOMMUNICATIONS' as const,
    type: 'SUBSIDIARY' as const,
    subtype: 'Telco Operator',
    founded: 2000,
    hq: 'Nairobi',
    ownership: 'Airtel Africa PLC (UK/India listed) ~100%',
    revenue: 'KES 28B (2023)',
    employees: '~600',
    description:
      'Second-largest telco by subscribers with ~20% market share. Operates Airtel Money. Has never turned a profit in Kenya despite years of operation. Has engaged in persistent price wars with Safaricom but cannot match M-Pesa\'s network effects. The failed 2019 merger with Telkom would have created a stronger competitor. Parent Airtel Africa is listed on both LSE and NSE.',
    keyFacts: [
      'Second largest telco — ~20% subscriber share but tiny revenue share vs Safaricom',
      'Has never been profitable in Kenya',
      'Airtel Money significantly trails M-Pesa with <5% of mobile money value',
      'Proposed merger with Telkom Kenya blocked by CAK in 2019',
      'Parent Airtel Africa listed on London Stock Exchange',
    ],
    tags: ['telco', 'foreign', 'india', 'airtel-africa', 'loss-making'],
    riskLevel: 'MEDIUM' as const,
  },
  {
    id: 'player-telkom',
    slug: 'telkom-kenya',
    name: 'Telkom Kenya',
    sector: 'TELECOMMUNICATIONS' as const,
    type: 'PRIVATE_COMPANY' as const,
    subtype: 'Telco Operator',
    founded: 1999,
    hq: 'Nairobi',
    ownership: 'Helios Investment Partners ~60%, GoK ~40%',
    revenue: 'KES 9B (2023)',
    employees: '~1,200',
    description:
      'Former state-owned telecom monopoly, privatised in 2007 when France Telecom (Orange) acquired a stake. Orange later exited and Helios Investment Partners (pan-African PE firm) became majority owner. Failed merger with Airtel Kenya blocked by CAK in 2019. Has pivoted to enterprise, B2B, and data services, abandoning mass consumer market. Significant real estate portfolio from legacy government land holdings.',
    keyFacts: [
      'Former state telecom monopoly — privatised 2007',
      'Orange (France Telecom) exited — Helios Investment Partners now majority owner',
      'Proposed merger with Airtel blocked by CAK 2019',
      'Pivoted to enterprise/B2B — exiting consumer market',
      'Large real estate portfolio from legacy government land',
    ],
    tags: ['telco', 'private-equity', 'enterprise', 'b2b', 'helios'],
    riskLevel: 'MEDIUM' as const,
  },

  // ── ENERGY SOEs ──────────────────────────────────────────────────────────
  {
    id: 'player-kplc',
    slug: 'kenya-power',
    name: 'Kenya Power & Lighting Company (KPLC)',
    sector: 'ENERGY' as const,
    type: 'SOE' as const,
    subtype: 'Electricity Distributor',
    founded: 1922,
    hq: 'Nairobi',
    ownership: 'GoK ~51.7%, Public ~48.3% (NSE listed)',
    revenue: 'KES 142B (2023)',
    employees: '~7,500',
    marketCap: 'KES 4B',
    description:
      'State-controlled monopoly distributor of electricity in Kenya. Buys power from KenGen, independent power producers (IPPs), and TANESCO (Tanzania) and sells to consumers. Chronically loss-making due to: forex losses on USD-denominated Power Purchase Agreements, system losses of ~25-30% from theft and technical faults, and government-capped tariffs. Subject of major restructuring attempts. The Adani Group deal for partial privatisation was controversially cancelled in 2024.',
    keyFacts: [
      'Monopoly electricity distributor — all 9M+ connections go through KPLC',
      'Power Purchase Agreements (PPAs) mostly USD-denominated — massive forex exposure',
      '~25-30% system losses from theft and technical faults',
      'Adani Group transmission deal cancelled November 2024 amid fraud allegations',
      'Government controls tariffs — not cost-reflective, erodes margins',
      'Multiple management changes under government pressure',
    ],
    tags: ['energy', 'soe', 'nse', 'utility', 'electricity', 'high-risk'],
    riskLevel: 'HIGH' as const,
  },
  {
    id: 'player-kengen',
    slug: 'kengen',
    name: 'KenGen (Kenya Electricity Generating Company)',
    sector: 'ENERGY' as const,
    type: 'SOE' as const,
    subtype: 'Electricity Generator',
    founded: 1997,
    hq: 'Nairobi',
    ownership: 'GoK ~70%, Public ~30% (NSE listed)',
    revenue: 'KES 32B (2023)',
    employees: '~3,200',
    marketCap: 'KES 14B',
    description:
      'Generates approximately 70% of Kenya\'s electricity. Heavily geothermal — Kenya is the world\'s 7th largest geothermal power producer, with the Olkaria complex in the Rift Valley being the largest geothermal facility in Africa. Also operates significant hydro, wind (Ngong Hills), and gas capacity. Sells power exclusively to KPLC under long-term PPAs. Exports drilling expertise to other East African countries.',
    keyFacts: [
      'Generates ~70% of Kenya\'s installed electricity capacity',
      'Olkaria geothermal complex — largest in Africa, ~900MW',
      'Kenya is world\'s 7th largest geothermal producer — largely due to KenGen',
      'Kenya has ~90%+ renewable electricity mix thanks to KenGen\'s portfolio',
      'Exports geothermal drilling services to Ethiopia, Djibouti, Rwanda',
    ],
    tags: ['energy', 'soe', 'nse', 'geothermal', 'renewable', 'electricity'],
    riskLevel: 'LOW' as const,
  },
  {
    id: 'player-kpc',
    slug: 'kenya-pipeline-company',
    name: 'Kenya Pipeline Company (KPC)',
    sector: 'ENERGY' as const,
    type: 'SOE' as const,
    subtype: 'Petroleum Infrastructure',
    founded: 1973,
    hq: 'Nairobi',
    ownership: 'GoK (100%)',
    revenue: 'KES 18B (2023)',
    employees: '~1,500',
    description:
      'State-owned company that transports refined petroleum products via pipeline from Mombasa to Nairobi, Eldoret, and Kisumu. Critical national infrastructure — virtually all petroleum products consumed in Kenya and Uganda pass through the KPC system. Has been subject to major corruption scandals. Expansion to extend pipeline to Uganda is ongoing but delayed.',
    keyFacts: [
      'Controls the Mombasa-Nairobi-Eldoret pipeline — all petroleum must pass through',
      'Major graft scandal (2019) led to multiple arrests and management changes',
      'Extension to Uganda delayed by procurement and financing issues',
      'Fuel products for Uganda transit through KPC — major revenue stream',
    ],
    tags: ['energy', 'soe', 'petroleum', 'infrastructure', 'corruption-history'],
    riskLevel: 'MEDIUM' as const,
  },
  {
    id: 'player-nock',
    slug: 'national-oil-kenya',
    name: 'National Oil Corporation of Kenya (NOCK)',
    sector: 'ENERGY' as const,
    type: 'SOE' as const,
    subtype: 'National Oil Company',
    founded: 1981,
    hq: 'Nairobi',
    ownership: 'GoK (100%)',
    revenue: 'KES 8B (2023)',
    employees: '~500',
    description:
      'State-owned national oil company. Operates downstream retail fuel stations (National Oil brand), upstream exploration activities, and strategic petroleum reserves management. Has been commercially weak — unable to compete effectively with private operators like TotalEnergies and Rubis. Government uses NOCK to regulate fuel prices.',
    keyFacts: [
      'National Oil branded fuel stations — smaller market share than Total, Rubis',
      'Manages strategic petroleum reserve on behalf of government',
      'Upstream exploration in Turkana Basin (with Tullow Oil)',
      'Used as a government price stabilisation tool',
    ],
    tags: ['energy', 'soe', 'petroleum', 'downstream', 'upstream'],
    riskLevel: 'MEDIUM' as const,
  },

  // ── PARASTATALS & INFRASTRUCTURE ─────────────────────────────────────────
  {
    id: 'player-kpa',
    slug: 'kenya-ports-authority',
    name: 'Kenya Ports Authority (KPA)',
    sector: 'TRANSPORT' as const,
    type: 'SOE' as const,
    subtype: 'Port Authority',
    founded: 1978,
    hq: 'Mombasa',
    ownership: 'GoK (100%)',
    revenue: 'KES 28B (2023)',
    employees: '~4,500',
    description:
      'Manages the Port of Mombasa — East and Central Africa\'s largest port. Critical node for regional trade. Handles imports for Kenya, Uganda, Rwanda, DRC, South Sudan, and Burundi. The Port of Mombasa is in direct competition with Dar es Salaam (Tanzania) for regional hinterland cargo. Lamu Port South Sudan Ethiopia Transport (LAPSSET) corridor is a major new infrastructure project under KPA oversight.',
    keyFacts: [
      'Port of Mombasa handles ~35M tonnes annually — largest in East Africa',
      'Serves as gateway for landlocked Uganda, Rwanda, South Sudan, DRC',
      'Competing with Dar es Salaam port for regional hinterland traffic',
      'LAPSSET corridor — Lamu port expansion and new northern corridor',
      'Chinese-financed container terminal expansion ongoing',
    ],
    tags: ['transport', 'soe', 'port', 'mombasa', 'infrastructure', 'regional'],
    riskLevel: 'LOW' as const,
  },
  {
    id: 'player-kq',
    slug: 'kenya-airways',
    name: 'Kenya Airways (KQ)',
    sector: 'TRANSPORT' as const,
    type: 'SOE' as const,
    subtype: 'National Airline',
    founded: 1977,
    hq: 'Nairobi',
    ownership: 'GoK ~48.9%, KLM (Air France-KLM) ~7.8%, Public ~43.3% (NSE listed)',
    revenue: 'KES 130B (2023)',
    employees: '~4,000',
    marketCap: 'KES 3B',
    description:
      'Kenya\'s national carrier and one of Africa\'s largest airlines. Has been in financial distress since at least 2017, requiring multiple government bailouts. COVID-19 devastated operations. The government has been unable to complete a planned full nationalization or find a strategic investor. Operates Nairobi as a major African hub. KLM holds a strategic alliance stake. Multiple restructuring plans have failed.',
    keyFacts: [
      'Loss-making for nearly a decade — government has injected KES 100B+ in bailouts',
      'COVID-19 nearly collapsed the airline — full suspension of ops in 2020',
      'Nationalization plan (Project Kuunda) stalled in parliament',
      'KLM (Air France-KLM) strategic partner holds ~7.8%',
      'JKIA (Nairobi) is KQ\'s hub — Adani deal for JKIA cancelled 2024',
      'Fleet rationalisation and route network cuts ongoing',
    ],
    tags: ['transport', 'soe', 'nse', 'airline', 'distressed', 'bailout'],
    riskLevel: 'CRITICAL' as const,
  },
  {
    id: 'player-krc',
    slug: 'kenya-railways',
    name: 'Kenya Railways Corporation',
    sector: 'TRANSPORT' as const,
    type: 'SOE' as const,
    subtype: 'Railway Operator',
    founded: 1978,
    hq: 'Nairobi',
    ownership: 'GoK (100%)',
    revenue: 'KES 12B (2023)',
    employees: '~2,500',
    description:
      'Operates the Standard Gauge Railway (SGR) — a Chinese-built and financed line from Mombasa to Nairobi (2017) and Nairobi to Naivasha (2019). SGR is Kenya\'s largest infrastructure project since independence. The SGR loan from Exim Bank of China (~$5B) is a major portion of Kenya\'s public debt. Sgr has been controversial due to low freight utilisation, high debt service, and concerns about loan conditionalities.',
    keyFacts: [
      'Operates SGR — $5B Chinese Exim Bank funded Mombasa-Nairobi-Naivasha railway',
      'SGR debt is ~5% of Kenya\'s total public debt',
      'SGR freight volumes below projections — revenue shortfall ongoing',
      'Old metre gauge (Lunatic Express legacy) still operated in some areas',
      'SGR loan terms controversial — Mombasa port as collateral clause reported',
    ],
    tags: ['transport', 'soe', 'railway', 'sgr', 'china-debt', 'infrastructure'],
    riskLevel: 'MEDIUM' as const,
  },

  // ── CONGLOMERATES & PRIVATE COMPANIES ────────────────────────────────────
  {
    id: 'player-bidco',
    slug: 'bidco-africa',
    name: 'Bidco Africa',
    sector: 'MANUFACTURING' as const,
    type: 'PRIVATE_COMPANY' as const,
    subtype: 'FMCG Manufacturer',
    founded: 1985,
    hq: 'Thika',
    ownership: 'Vimal Shah family (private, 100%)',
    revenue: 'KES 80B+ (est, 2023)',
    employees: '~5,000',
    description:
      'Largest privately-held FMCG manufacturer in East Africa. Produces cooking oils (Elianto, Kimbo), soaps, detergents, and personal care products. Controls significant share of Kenya\'s edible oils market. Vimal Shah family maintains complete private ownership. Major employer in Thika. Expanding into palm oil farming in Uganda and DRC to secure raw material supply.',
    keyFacts: [
      'Vimal Shah family owns 100% — no outside investors',
      'Elianto and Kimbo are dominant household brand names in East Africa',
      'Controls ~40% of Kenya\'s cooking oil market',
      'Expanding into palm oil value chain in Uganda/DRC',
      'Major employer in Thika Industrial Area',
    ],
    tags: ['manufacturing', 'fmcg', 'private', 'family-owned', 'thika', 'cooking-oil'],
    riskLevel: 'LOW' as const,
  },
  {
    id: 'player-centum',
    slug: 'centum-investment',
    name: 'Centum Investment Company PLC',
    sector: 'DIVERSIFIED' as const,
    type: 'LISTED_COMPANY' as const,
    subtype: 'Investment Holding Company',
    founded: 1967,
    hq: 'Nairobi',
    ownership: 'Public (NSE listed), Chris Kirubi estate ~25%, TransCentury ~8%',
    revenue: 'KES 12B (2023)',
    employees: '~500 (holding co)',
    marketCap: 'KES 5B',
    description:
      'Diversified investment holding company. Portfolio includes Two Rivers Development (real estate and Two Rivers Mall), Almasi Beverages (Coca-Cola bottler for Western/Central/Rift Valley Kenya), Longhorn Publishers (education), and financial services. Chris Kirubi was the iconic chairman and largest individual shareholder until his death in 2021. The Kirubi estate remains a dominant shareholder.',
    keyFacts: [
      'Chris Kirubi (died 2021) built Centum into a major conglomerate',
      'Two Rivers Mall and Development is flagship real estate asset',
      'Almasi Beverages — Coca-Cola bottler for large swath of Kenya',
      'Longhorn Publishers dominates Kenya\'s educational publishing market',
      'Listed on NSE since 1967 — one of oldest listed companies',
    ],
    tags: ['diversified', 'nse', 'real-estate', 'beverages', 'kirubi', 'investment-holding'],
    riskLevel: 'MEDIUM' as const,
  },
  {
    id: 'player-bat',
    slug: 'bat-kenya',
    name: 'British American Tobacco Kenya PLC (BAT)',
    sector: 'MANUFACTURING' as const,
    type: 'LISTED_COMPANY' as const,
    subtype: 'Tobacco Manufacturer',
    founded: 1907,
    hq: 'Nairobi',
    ownership: 'BAT PLC (UK) ~66%, Public ~34% (NSE listed)',
    revenue: 'KES 22B (2023)',
    employees: '~500',
    marketCap: 'KES 32B',
    description:
      'Kenya\'s only significant tobacco manufacturer. Produces Sportsman, Safari, Rooster, and premium international brands. Buys Kenyan tobacco leaf from smallholder farmers in Western Kenya. One of NSE\'s highest dividend-yielding stocks. BAT Kenya is also a regional export hub for East Africa.',
    keyFacts: [
      'Monopoly tobacco manufacturer in Kenya',
      'High dividend yield — consistent payer to NSE investors',
      'Sources tobacco leaf from Western Kenya smallholders',
      'BAT PLC (UK) holds ~66% majority',
      'Regional export hub for East Africa',
    ],
    tags: ['manufacturing', 'nse', 'tobacco', 'foreign', 'bat-plc', 'fmcg'],
    riskLevel: 'LOW' as const,
  },
  {
    id: 'player-bamburi',
    slug: 'bamburi-cement',
    name: 'Bamburi Cement PLC',
    sector: 'MANUFACTURING' as const,
    type: 'LISTED_COMPANY' as const,
    subtype: 'Cement Manufacturer',
    founded: 1951,
    hq: 'Nairobi',
    ownership: 'Savanna Clinker (Amsons Group, Tanzania) ~100% after 2024 acquisition',
    revenue: 'KES 28B (2023)',
    employees: '~1,200',
    marketCap: 'KES 18B',
    description:
      'Kenya\'s largest cement company. Formerly part of Holcim Group (Switzerland) which sold its East African operations to Amsons Group (Tanzania) in 2024 in a controversial deal. Operates two plants (Nairobi and Mombasa). Major supplier to Kenya\'s construction sector. The Holcim exit and Amsons acquisition reshuffled East Africa\'s cement industry dynamics.',
    keyFacts: [
      'Holcim (Switzerland) sold East Africa operations to Amsons Group (Tanzania) in 2024',
      'Largest cement company in Kenya by volume and revenue',
      'Two plants: Nairobi (Athi River) and Mombasa',
      'Acquisition controversial — competition and foreign ownership concerns',
    ],
    tags: ['manufacturing', 'nse', 'cement', 'construction', 'tanzania', 'holcim-exit'],
    riskLevel: 'LOW' as const,
  },

  // ── INSURERS ─────────────────────────────────────────────────────────────
  {
    id: 'player-jubilee',
    slug: 'jubilee-insurance',
    name: 'Jubilee Holdings Limited',
    sector: 'INSURANCE' as const,
    type: 'LISTED_COMPANY' as const,
    subtype: 'Composite Insurer',
    founded: 1937,
    hq: 'Nairobi',
    ownership: 'Aga Khan Fund for Economic Development (AKFED) ~36%, Public (NSE listed)',
    revenue: 'KES 42B (2023)',
    employees: '~2,000',
    marketCap: 'KES 14B',
    description:
      'Largest insurer in East Africa. Part of the Aga Khan Development Network (AKDN). Operates in Kenya, Uganda, Tanzania, Burundi, and Mauritius. Offers life, general, and health insurance. Sold its general insurance business to Allianz SE in 2021 while retaining life and health. AKFED connection links it to Jubilee Bank, DTB, and other AKDN entities in Kenya.',
    keyFacts: [
      'Largest insurer in East Africa by premium income',
      'AKFED (Aga Khan) controls ~36%',
      'Sold general insurance to Allianz SE in 2021 — focus on life and health',
      'Part of AKDN ecosystem alongside DTB, Diamond Trust',
      'Operations in Kenya, Uganda, Tanzania, Burundi, Mauritius',
    ],
    tags: ['insurance', 'nse', 'akdn', 'aga-khan', 'life-insurance', 'health'],
    riskLevel: 'LOW' as const,
  },
  {
    id: 'player-britam',
    slug: 'britam',
    name: 'Britam Holdings PLC',
    sector: 'INSURANCE' as const,
    type: 'LISTED_COMPANY' as const,
    subtype: 'Composite Insurer & Asset Manager',
    founded: 1965,
    hq: 'Nairobi',
    ownership: 'Public (NSE listed), Leapfrog Investments ~23%, AfricInvest ~13%',
    revenue: 'KES 35B (2023)',
    employees: '~1,800',
    marketCap: 'KES 6B',
    description:
      'Composite insurance company and asset manager. Operates insurance (life, general, health) and fund management via Britam Asset Managers. Regional presence in Uganda, Tanzania, Rwanda, South Sudan, Mozambique, and Malawi. LeapFrog Investments (impact investor) and AfricInvest are significant shareholders. Has been undertaking restructuring to improve profitability.',
    keyFacts: [
      'LeapFrog Investments (impact PE) holds ~23%',
      'Britam Asset Managers — significant fund management business',
      'Regional presence in 7 African countries',
      'Restructuring ongoing — sold some businesses to focus on core insurance',
    ],
    tags: ['insurance', 'nse', 'asset-management', 'regional', 'leapfrog'],
    riskLevel: 'MEDIUM' as const,
  },
  {
    id: 'player-cic',
    slug: 'cic-group',
    name: 'CIC Insurance Group PLC',
    sector: 'INSURANCE' as const,
    type: 'LISTED_COMPANY' as const,
    subtype: 'Composite Insurer',
    founded: 1978,
    hq: 'Nairobi',
    ownership: 'Co-operative Movement ~56%, Public (NSE listed)',
    revenue: 'KES 18B (2023)',
    employees: '~1,200',
    marketCap: 'KES 5B',
    description:
      'Insurance arm of Kenya\'s co-operative movement. The co-operative sector owns majority stake, mirroring the Co-operative Bank structure. Provides insurance to co-operative societies, SACCO members, and agricultural communities. Regional presence in Uganda, South Sudan, and Malawi.',
    keyFacts: [
      'Co-operative movement owns ~56% — mirrors Co-op Bank ownership structure',
      'Primary insurer for Kenya\'s SACCO and co-operative sector',
      'Strong in agricultural and rural insurance products',
      'Regional in Uganda, South Sudan, Malawi',
    ],
    tags: ['insurance', 'nse', 'cooperatives', 'saccos', 'agricultural'],
    riskLevel: 'LOW' as const,
  },

  // ── INTERNATIONAL ORGANIZATIONS ──────────────────────────────────────────
  {
    id: 'player-imf',
    slug: 'imf-kenya',
    name: 'IMF Kenya (International Monetary Fund)',
    sector: 'GOVERNMENT' as const,
    type: 'INTERNATIONAL_ORG' as const,
    subtype: 'Multilateral Lender',
    hq: 'Nairobi (Resident Rep)',
    description:
      'The IMF has a significant ongoing relationship with Kenya via an Extended Credit Facility (ECF) and Extended Fund Facility (EFF) program approved in 2021 and extended. The program provides ~$2.34B in support conditional on fiscal consolidation, revenue mobilisation, and structural reforms. IMF program conditions have directly shaped Kenya\'s budget policies, including the controversial tax measures in Finance Bill 2024.',
    keyFacts: [
      'ECF/EFF program ~$2.34B approved 2021, extended multiple times',
      'IMF conditions drove aggressive revenue targets in FY2023/24 budget',
      'Finance Bill 2024 tax measures partly driven by IMF fiscal targets',
      'IMF issues regular Article IV consultation reports on Kenya\'s economy',
      'Kenya\'s IMF relationship shapes CBK monetary policy communication',
    ],
    tags: ['international', 'imf', 'lender', 'fiscal-policy', 'conditionality'],
    riskLevel: 'LOW' as const,
  },
  {
    id: 'player-worldbank',
    slug: 'world-bank-kenya',
    name: 'World Bank Kenya',
    sector: 'GOVERNMENT' as const,
    type: 'INTERNATIONAL_ORG' as const,
    subtype: 'Multilateral Development Bank',
    hq: 'Nairobi',
    description:
      'The World Bank Group (IDA and IBRD) is Kenya\'s largest multilateral creditor with a portfolio of ~$7B in active projects. Key sectors include infrastructure, social protection (Inua Jamii cash transfers), health, education, and climate resilience. IFC (World Bank private sector arm) is active in Kenya\'s financial sector.',
    keyFacts: [
      'Active portfolio of ~$7B across infrastructure, health, education, social protection',
      'Inua Jamii social protection program funded partly by World Bank',
      'IFC (private sector arm) active in Kenyan banking and agribusiness',
      'Kenya\'s largest multilateral creditor',
    ],
    tags: ['international', 'world-bank', 'development', 'infrastructure', 'debt'],
    riskLevel: 'LOW' as const,
  },
]

// ─── MACRO INDICATORS ────────────────────────────────────────────────────────

// Real approximate values for Kenya macro indicators (2024-2026)
// USD/KES: peaked ~161 in early 2024, recovered to ~129 by late 2024, ~130 in 2025
const USD_KES_SERIES = [
  129.5, 130.2, 130.8, 131.5, 132.0, 131.2, 130.5, 131.8,
  132.5, 133.2, 135.0, 140.2, 148.5, 155.0, 158.3, 161.4,
  157.2, 151.0, 145.5, 141.0, 138.2, 135.5, 132.8, 130.5,
]

// CBR: raised to 13% in Feb 2024, held at 13%, cut to 12.5% Aug 2024, 11.25% Oct 2024, 10.75% Dec 2024
const CBR_SERIES = [
  10.75, 10.75, 11.25, 11.25, 12.5, 12.5, 13.0, 13.0,
  13.0, 13.0, 13.0, 13.0, 12.5, 12.5, 10.5, 10.5,
  8.75, 8.75, 8.75, 7.5, 7.5, 7.5, 7.0, 7.0,
]

// Inflation: peaked ~9.6% Oct 2022, declined to ~3.2% by mid-2024
const INFLATION_SERIES = [
  3.2, 3.5, 4.0, 4.2, 5.1, 5.5, 6.0, 6.8,
  7.5, 8.0, 8.5, 9.0, 9.2, 9.6, 9.1, 8.5,
  7.9, 7.2, 6.5, 5.8, 5.2, 4.8, 4.2, 3.8,
]

// NSE 20: ~1,500-1,700 range 2023-2024
const NSE20_SERIES = [
  1750, 1720, 1680, 1650, 1600, 1580, 1550, 1520,
  1500, 1480, 1520, 1560, 1590, 1620, 1650, 1680,
  1700, 1720, 1750, 1780, 1800, 1820, 1850, 1870,
]

// 91-day T-bill: rose with CBR tightening, peaked ~16.9%
const TBILL_91_SERIES = [
  13.0, 13.2, 13.5, 14.0, 14.5, 15.0, 15.5, 16.0,
  16.5, 16.9, 16.7, 16.5, 16.0, 15.5, 15.0, 14.5,
  14.0, 13.5, 13.0, 12.5, 12.0, 11.5, 11.0, 10.5,
]

// GDP growth: ~5.5% 2023, ~5.0% 2024
const GDP_SERIES = [
  5.0, 5.0, 5.1, 5.1, 5.2, 5.2, 5.3, 5.3,
  5.4, 5.4, 5.5, 5.5, 5.4, 5.3, 5.2, 5.1,
  5.0, 5.0, 4.9, 4.9, 4.8, 4.9, 5.0, 5.1,
]

// Central government debt as % of GDP (World Bank GC.DOD.TOTL.GD.ZS — illustrative series)
const DEBT_GDP_SERIES = [
  71.0, 70.5, 70.2, 69.8, 69.5, 69.0, 68.8, 68.5,
  68.2, 67.9, 67.6, 67.3, 67.0, 66.8, 66.5, 66.2,
  66.0, 65.8, 65.5, 65.2, 64.9, 64.8, 65.0, 65.2,
]

// Forex reserves: months of import cover
const FOREX_SERIES = [
  4.2, 4.1, 4.0, 3.9, 3.8, 3.7, 3.8, 3.9,
  4.0, 4.0, 4.1, 4.2, 4.1, 4.0, 3.9, 3.8,
  3.7, 3.8, 3.9, 4.0, 4.1, 4.2, 4.3, 4.4,
]

const INDICATORS = [
  {
    id: 'indicator-usdkes',
    slug: 'usd-kes-rate',
    name: 'USD/KES Exchange Rate',
    value: 129.5,
    unit: 'KES per USD',
    trend: 'DOWN' as const,
    changePercent: -1.3,
    source: 'Central Bank of Kenya',
    series: USD_KES_SERIES,
  },
  {
    id: 'indicator-cbr',
    slug: 'cbr-rate',
    name: 'Central Bank Rate (CBR)',
    value: 10.75,
    unit: '%',
    trend: 'DOWN' as const,
    changePercent: -2.25,
    source: 'Central Bank of Kenya',
    series: CBR_SERIES,
  },
  {
    id: 'indicator-inflation',
    slug: 'cpi-inflation',
    name: 'CPI Inflation (YoY)',
    value: 3.2,
    unit: '%',
    trend: 'DOWN' as const,
    changePercent: -0.3,
    source: 'Kenya National Bureau of Statistics (KNBS)',
    series: INFLATION_SERIES,
  },
  {
    id: 'indicator-nse20',
    slug: 'nse-20-index',
    name: 'NSE 20 Share Index',
    value: 1750,
    unit: 'points',
    trend: 'UP' as const,
    changePercent: 1.5,
    source: 'Nairobi Securities Exchange',
    series: NSE20_SERIES,
  },
  {
    id: 'indicator-tbill91',
    slug: 'tbill-91-day',
    name: '91-Day T-Bill Rate',
    value: 13.0,
    unit: '%',
    trend: 'DOWN' as const,
    changePercent: -3.9,
    source: 'Central Bank of Kenya',
    series: TBILL_91_SERIES,
  },
  {
    id: 'indicator-gdp',
    slug: 'gdp-growth',
    name: 'GDP Growth Rate',
    value: 5.0,
    unit: '%',
    trend: 'STABLE' as const,
    changePercent: 0.1,
    source: 'World Bank / KNBS',
    series: GDP_SERIES,
  },
  {
    id: 'indicator-debt-gdp',
    slug: 'debt-to-gdp',
    name: 'Government Debt to GDP',
    value: 68.5,
    unit: '%',
    trend: 'STABLE' as const,
    changePercent: 0.2,
    source: 'World Bank',
    series: DEBT_GDP_SERIES,
  },
  {
    id: 'indicator-forex',
    slug: 'forex-reserves',
    name: 'Forex Reserves (Import Cover)',
    value: 4.2,
    unit: 'months',
    trend: 'UP' as const,
    changePercent: 0.2,
    source: 'Central Bank of Kenya',
    series: FOREX_SERIES,
  },
]

// ─── ECONOMIC EVENTS ─────────────────────────────────────────────────────────

const EVENTS = [
  {
    id: 'event-cbr-feb2023',
    date: new Date('2023-02-01'),
    title: 'CBK Raises CBR to 8.75% — Start of Tightening Cycle',
    description: 'Central Bank of Kenya raises the Central Bank Rate to 8.75% from 8.25%, beginning a tightening cycle to combat rising inflation driven by global commodity prices and a weakening shilling.',
    impact: 'MEDIUM' as const,
    impactType: 'NEGATIVE' as const,
    sectors: ['BANKING' as const, 'MANUFACTURING' as const],
    source: 'CBK Monetary Policy Committee',
    sourceUrl: 'https://www.centralbank.go.ke',
    isAiExtracted: false,
    playerIds: ['player-cbk', 'player-kcb', 'player-equity', 'player-cooperative'],
  },
  {
    id: 'event-cbr-jun2023',
    date: new Date('2023-06-01'),
    title: 'CBK Raises CBR to 10.5% — Aggressive Tightening',
    description: 'CBK raises rate sharply to 10.5% as inflation remains elevated and the Kenya Shilling weakens significantly against the dollar. This is the highest CBR in over a decade.',
    impact: 'HIGH' as const,
    impactType: 'NEGATIVE' as const,
    sectors: ['BANKING' as const, 'REAL_ESTATE' as const, 'MANUFACTURING' as const],
    source: 'CBK Monetary Policy Committee',
    sourceUrl: 'https://www.centralbank.go.ke',
    isAiExtracted: false,
    playerIds: ['player-cbk', 'player-kcb', 'player-equity', 'player-kplc'],
  },
  {
    id: 'event-kes-depreciation-2023',
    date: new Date('2023-07-15'),
    title: 'Kenya Shilling Hits Record Low of ~161 per USD',
    description: 'The Kenya Shilling depreciates to a record low of approximately KES 161 per USD, driven by dollar scarcity, rising import bills, and global risk-off sentiment. The depreciation severely impacts companies with USD-denominated liabilities including Kenya Power and Kenya Airways.',
    impact: 'HIGH' as const,
    impactType: 'NEGATIVE' as const,
    sectors: ['BANKING' as const, 'ENERGY' as const, 'TRANSPORT' as const, 'MANUFACTURING' as const],
    source: 'Central Bank of Kenya / Market',
    sourceUrl: 'https://www.centralbank.go.ke',
    isAiExtracted: false,
    playerIds: ['player-cbk', 'player-kplc', 'player-kq', 'player-krc', 'player-airtel'],
  },
  {
    id: 'event-eurobond-repayment-2024',
    date: new Date('2024-02-07'),
    title: 'Kenya Successfully Repays $2B Eurobond',
    description: 'Kenya repays a $2 billion Eurobond on schedule, resolving months of market uncertainty about a potential default. The government used a combination of a new $1.5B Eurobond issuance at 10.375% and IMF/World Bank budget support. The repayment restored market confidence and began a KES recovery.',
    impact: 'HIGH' as const,
    impactType: 'POSITIVE' as const,
    sectors: ['BANKING' as const, 'GOVERNMENT' as const],
    source: 'National Treasury',
    sourceUrl: 'https://www.treasury.go.ke',
    isAiExtracted: false,
    playerIds: ['player-treasury', 'player-cbk', 'player-imf', 'player-worldbank'],
  },
  {
    id: 'event-finance-bill-protests-2024',
    date: new Date('2024-06-20'),
    title: 'Finance Bill 2024 Protests — Ruto Withdraws Bill',
    description: 'Mass youth-led protests (#RejectFinanceBill2024) erupt across Kenya against proposed tax hikes in Finance Bill 2024. Protesters storm parliament. At least 39 people killed by security forces. President Ruto withdraws the entire Finance Bill and dissolves most of his cabinet in response. The episode reshapes Kenya\'s political economy significantly.',
    impact: 'HIGH' as const,
    impactType: 'NEGATIVE' as const,
    sectors: ['GOVERNMENT' as const, 'BANKING' as const, 'TELECOMMUNICATIONS' as const],
    source: 'Multiple',
    sourceUrl: 'https://nation.africa',
    isAiExtracted: false,
    playerIds: ['player-treasury', 'player-kra', 'player-safaricom', 'player-imf'],
  },
  {
    id: 'event-safaricom-ethiopia-2022',
    date: new Date('2022-07-06'),
    title: 'Safaricom Officially Launches in Ethiopia',
    description: 'Safaricom launches commercial operations in Ethiopia under the brand name "Safaricom Ethiopia". The entry into Africa\'s second most populous nation (120M+) was won in a competitive bid at $850M for a 15-year license. The consortium includes Vodacom, Vodafone, and CDC (now British International Investment).',
    impact: 'HIGH' as const,
    impactType: 'POSITIVE' as const,
    sectors: ['TELECOMMUNICATIONS' as const, 'FINTECH' as const],
    source: 'Safaricom PLC',
    sourceUrl: 'https://www.safaricom.co.ke',
    isAiExtracted: false,
    playerIds: ['player-safaricom'],
  },
  {
    id: 'event-adani-deal-cancelled-2024',
    date: new Date('2024-11-22'),
    title: 'Adani Group JKIA and KPLC Deals Cancelled',
    description: 'The Kenyan government cancels two major deals with India\'s Adani Group — a 30-year concession to manage JKIA (Jomo Kenyatta International Airport) and a transmission line deal with Kenya Power. The cancellation follows US federal indictment of Gautam Adani on bribery charges. The Ruto administration initially defended the deals before reversing course.',
    impact: 'HIGH' as const,
    impactType: 'NEUTRAL' as const,
    sectors: ['TRANSPORT' as const, 'ENERGY' as const, 'GOVERNMENT' as const],
    source: 'Kenya Airports Authority / National Treasury',
    sourceUrl: 'https://www.treasury.go.ke',
    isAiExtracted: false,
    playerIds: ['player-kplc', 'player-kq', 'player-treasury'],
  },
  {
    id: 'event-cbr-cut-aug2024',
    date: new Date('2024-08-06'),
    title: 'CBK Cuts CBR to 12.5% — Easing Cycle Begins',
    description: 'CBK cuts the Central Bank Rate from 13% to 12.5%, marking the start of a monetary easing cycle. Inflation has dropped to ~4.3% and the shilling has recovered to ~130 from its 161 peak. This is the first rate cut since 2020.',
    impact: 'MEDIUM' as const,
    impactType: 'POSITIVE' as const,
    sectors: ['BANKING' as const, 'REAL_ESTATE' as const, 'MANUFACTURING' as const],
    source: 'CBK Monetary Policy Committee',
    sourceUrl: 'https://www.centralbank.go.ke',
    isAiExtracted: false,
    playerIds: ['player-cbk', 'player-kcb', 'player-equity', 'player-cooperative', 'player-ncba'],
  },
  {
    id: 'event-cbr-cut-dec2024',
    date: new Date('2024-12-05'),
    title: 'CBK Cuts CBR to 10.75% — Third Consecutive Cut',
    description: 'CBK delivers its third consecutive rate cut, bringing the CBR to 10.75% from 11.25%. Inflation is well within the 2.5-7.5% target band. The easing supports credit growth and economic recovery after the Finance Bill protests dampened economic activity.',
    impact: 'MEDIUM' as const,
    impactType: 'POSITIVE' as const,
    sectors: ['BANKING' as const, 'REAL_ESTATE' as const],
    source: 'CBK Monetary Policy Committee',
    sourceUrl: 'https://www.centralbank.go.ke',
    isAiExtracted: false,
    playerIds: ['player-cbk', 'player-kcb', 'player-equity', 'player-hf-group'],
  },
  {
    id: 'event-airtel-telkom-merger-blocked',
    date: new Date('2019-10-16'),
    title: 'CAK Blocks Airtel-Telkom Kenya Merger',
    description: 'The Competition Authority of Kenya (CAK) blocks the proposed merger between Airtel Kenya and Telkom Kenya on grounds that it would substantially reduce competition in the mobile voice and data market. The ruling leaves both companies struggling independently against Safaricom\'s dominance.',
    impact: 'MEDIUM' as const,
    impactType: 'NEGATIVE' as const,
    sectors: ['TELECOMMUNICATIONS' as const],
    source: 'Competition Authority of Kenya',
    sourceUrl: 'https://www.cak.go.ke',
    isAiExtracted: false,
    playerIds: ['player-airtel', 'player-telkom', 'player-cak', 'player-ca'],
  },
  {
    id: 'event-nbk-acquisition-2019',
    date: new Date('2019-09-01'),
    title: 'KCB Group Acquires National Bank of Kenya',
    description: 'KCB Group completes the acquisition of National Bank of Kenya (NBK) after a share swap deal. NBK had massive non-performing loans and near-zero capital adequacy. The CBK-orchestrated deal prevents a bank collapse that would have been damaging to depositor confidence.',
    impact: 'HIGH' as const,
    impactType: 'POSITIVE' as const,
    sectors: ['BANKING' as const],
    source: 'CBK / KCB Group',
    sourceUrl: 'https://www.kcbgroup.com',
    isAiExtracted: false,
    playerIds: ['player-kcb', 'player-nbk', 'player-cbk', 'player-treasury'],
  },
  {
    id: 'event-kra-miss-2024',
    date: new Date('2024-07-15'),
    title: 'KRA Misses FY2023/24 Revenue Target by KES 410B',
    description: 'Kenya Revenue Authority reports it collected KES 2.16 trillion against a target of KES 2.57 trillion for FY2023/24 — a shortfall of ~KES 410 billion. The miss forces the Treasury to borrow more domestically and cut development expenditure. The shortfall was partly driven by the Finance Bill withdrawal which removed planned tax measures.',
    impact: 'HIGH' as const,
    impactType: 'NEGATIVE' as const,
    sectors: ['GOVERNMENT' as const, 'BANKING' as const],
    source: 'Kenya Revenue Authority',
    sourceUrl: 'https://www.kra.go.ke',
    isAiExtracted: false,
    playerIds: ['player-kra', 'player-treasury', 'player-imf'],
  },
  {
    id: 'event-mshwari-launch',
    date: new Date('2012-11-27'),
    title: 'M-Shwari Launches — Digital Credit Revolution Begins',
    description: 'Safaricom and Commercial Bank of Africa (now NCBA) launch M-Shwari, the first mobile savings and lending product in Kenya. M-Shwari allows M-Pesa users to save and borrow directly from their phones without visiting a bank. Within one year, M-Shwari becomes the largest microlender in Kenya\'s history.',
    impact: 'HIGH' as const,
    impactType: 'POSITIVE' as const,
    sectors: ['BANKING' as const, 'FINTECH' as const, 'TELECOMMUNICATIONS' as const],
    source: 'Safaricom / CBA',
    sourceUrl: 'https://www.safaricom.co.ke',
    isAiExtracted: false,
    playerIds: ['player-safaricom', 'player-ncba', 'player-cbk'],
  },
  {
    id: 'event-sgr-launch-2017',
    date: new Date('2017-05-31'),
    title: 'Standard Gauge Railway Mombasa-Nairobi Launched',
    description: 'President Kenyatta launches the Standard Gauge Railway (SGR) between Mombasa and Nairobi — Kenya\'s largest infrastructure project since independence. The line cost ~$3.8B funded by Chinese Exim Bank. The SGR cuts the journey from 10+ hours to 5 hours. Freight services begin but face below-target utilisation.',
    impact: 'HIGH' as const,
    impactType: 'POSITIVE' as const,
    sectors: ['TRANSPORT' as const, 'GOVERNMENT' as const],
    source: 'Government of Kenya',
    sourceUrl: 'https://www.krc.co.ke',
    isAiExtracted: false,
    playerIds: ['player-krc', 'player-kpa', 'player-treasury'],
  },
]

// ─── RELATIONSHIPS ────────────────────────────────────────────────────────────

const RELATIONSHIPS = [
  // Regulatory relationships
  { id: 'rel-cbk-kcb', sourceId: 'player-cbk', targetId: 'player-kcb', type: 'REGULATORY' as const, label: 'CBK supervises KCB as Tier 1 bank', weight: 9, direction: 'UNIDIRECTIONAL' as const },
  { id: 'rel-cbk-equity', sourceId: 'player-cbk', targetId: 'player-equity', type: 'REGULATORY' as const, label: 'CBK supervises Equity Group', weight: 9, direction: 'UNIDIRECTIONAL' as const },
  { id: 'rel-cbk-coop', sourceId: 'player-cbk', targetId: 'player-cooperative', type: 'REGULATORY' as const, label: 'CBK supervises Co-op Bank', weight: 9, direction: 'UNIDIRECTIONAL' as const },
  { id: 'rel-cbk-ncba', sourceId: 'player-cbk', targetId: 'player-ncba', type: 'REGULATORY' as const, label: 'CBK supervises NCBA Group', weight: 9, direction: 'UNIDIRECTIONAL' as const },
  { id: 'rel-cbk-safaricom', sourceId: 'player-cbk', targetId: 'player-safaricom', type: 'REGULATORY' as const, label: 'CBK regulates M-Pesa under NPS Act', weight: 8, direction: 'UNIDIRECTIONAL' as const },
  { id: 'rel-cma-nse', sourceId: 'player-cma', targetId: 'player-nse', type: 'REGULATORY' as const, label: 'CMA licenses and oversees NSE', weight: 9, direction: 'UNIDIRECTIONAL' as const },
  { id: 'rel-cma-kcb', sourceId: 'player-cma', targetId: 'player-kcb', type: 'REGULATORY' as const, label: 'CMA regulates KCB as NSE listed entity', weight: 7, direction: 'UNIDIRECTIONAL' as const },
  { id: 'rel-ca-safaricom', sourceId: 'player-ca', targetId: 'player-safaricom', type: 'REGULATORY' as const, label: 'CA regulates Safaricom telecoms licence', weight: 9, direction: 'UNIDIRECTIONAL' as const },
  { id: 'rel-ca-airtel', sourceId: 'player-ca', targetId: 'player-airtel', type: 'REGULATORY' as const, label: 'CA regulates Airtel Kenya licence', weight: 9, direction: 'UNIDIRECTIONAL' as const },
  { id: 'rel-ca-telkom', sourceId: 'player-ca', targetId: 'player-telkom', type: 'REGULATORY' as const, label: 'CA regulates Telkom Kenya licence', weight: 9, direction: 'UNIDIRECTIONAL' as const },
  { id: 'rel-cak-airtel-telkom', sourceId: 'player-cak', targetId: 'player-airtel', type: 'REGULATORY' as const, label: 'CAK blocked Airtel-Telkom merger 2019', weight: 8, direction: 'UNIDIRECTIONAL' as const },

  // Ownership / subsidiary
  { id: 'rel-kcb-nbk', sourceId: 'player-kcb', targetId: 'player-nbk', type: 'OWNERSHIP' as const, label: 'KCB owns NBK 100% since 2019', weight: 10, direction: 'UNIDIRECTIONAL' as const },

  // Partnerships / JVs
  { id: 'rel-safaricom-ncba-mshwari', sourceId: 'player-safaricom', targetId: 'player-ncba', type: 'PARTNERSHIP' as const, label: 'M-Shwari JV — digital savings and lending', weight: 9, direction: 'BIDIRECTIONAL' as const },
  { id: 'rel-safaricom-kcb-mpesa', sourceId: 'player-safaricom', targetId: 'player-kcb', type: 'PARTNERSHIP' as const, label: 'KCB M-Pesa JV — mobile lending product', weight: 8, direction: 'BIDIRECTIONAL' as const },

  // Competitors
  { id: 'rel-safaricom-airtel-comp', sourceId: 'player-safaricom', targetId: 'player-airtel', type: 'COMPETITOR' as const, label: 'Competitors in mobile voice, data, money', weight: 9, direction: 'BIDIRECTIONAL' as const },
  { id: 'rel-safaricom-telkom-comp', sourceId: 'player-safaricom', targetId: 'player-telkom', type: 'COMPETITOR' as const, label: 'Competitors in enterprise telecoms', weight: 6, direction: 'BIDIRECTIONAL' as const },
  { id: 'rel-airtel-telkom-comp', sourceId: 'player-airtel', targetId: 'player-telkom', type: 'COMPETITOR' as const, label: 'Competitors — proposed merger blocked', weight: 7, direction: 'BIDIRECTIONAL' as const },
  { id: 'rel-kcb-equity-comp', sourceId: 'player-kcb', targetId: 'player-equity', type: 'COMPETITOR' as const, label: 'Direct competitors for largest bank title', weight: 9, direction: 'BIDIRECTIONAL' as const },

  // Supply chain / debt
  { id: 'rel-kengen-kplc', sourceId: 'player-kengen', targetId: 'player-kplc', type: 'SUPPLY_CHAIN' as const, label: 'KenGen sells ~70% of electricity to KPLC via PPAs', weight: 10, direction: 'UNIDIRECTIONAL' as const },
  { id: 'rel-kplc-treasury', sourceId: 'player-kplc', targetId: 'player-treasury', type: 'OWNERSHIP' as const, label: 'GoK owns ~51.7% of KPLC', weight: 9, direction: 'UNIDIRECTIONAL' as const },
  { id: 'rel-kengen-treasury', sourceId: 'player-kengen', targetId: 'player-treasury', type: 'OWNERSHIP' as const, label: 'GoK owns ~70% of KenGen', weight: 9, direction: 'UNIDIRECTIONAL' as const },
  { id: 'rel-kq-treasury', sourceId: 'player-kq', targetId: 'player-treasury', type: 'OWNERSHIP' as const, label: 'GoK owns ~48.9% of Kenya Airways', weight: 9, direction: 'UNIDIRECTIONAL' as const },
  { id: 'rel-kpc-treasury', sourceId: 'player-kpc', targetId: 'player-treasury', type: 'OWNERSHIP' as const, label: 'GoK owns 100% of KPC', weight: 10, direction: 'UNIDIRECTIONAL' as const },

  // AKDN ecosystem
  { id: 'rel-dtb-jubilee-akdn', sourceId: 'player-dtb', targetId: 'player-jubilee', type: 'PARTNERSHIP' as const, label: 'Both part of Aga Khan Development Network', weight: 7, direction: 'BIDIRECTIONAL' as const },

  // Co-op movement
  { id: 'rel-coop-cic', sourceId: 'player-cooperative', targetId: 'player-cic', type: 'PARTNERSHIP' as const, label: 'Co-operative movement controls both via Co-op Holdings', weight: 8, direction: 'BIDIRECTIONAL' as const },

  // IMF / Treasury
  { id: 'rel-imf-treasury', sourceId: 'player-imf', targetId: 'player-treasury', type: 'DEBT' as const, label: 'IMF ECF/EFF program ~$2.34B — conditionality relationship', weight: 9, direction: 'BIDIRECTIONAL' as const },
  { id: 'rel-worldbank-treasury', sourceId: 'player-worldbank', targetId: 'player-treasury', type: 'DEBT' as const, label: 'World Bank portfolio ~$7B in Kenya', weight: 9, direction: 'BIDIRECTIONAL' as const },
]

// ─── SEED FUNCTION ────────────────────────────────────────────────────────────

async function seed() {
  logger.info('Starting database seed...')

  try {
    // ── Players ────────────────────────────────────────────────────────────
    for (const player of PLAYERS) {
      await db.insert(players).values(player).onConflictDoNothing()
    }
    logger.info(`✓ Seeded ${PLAYERS.length} players`)

    // ── Macro Indicators ───────────────────────────────────────────────────
    const now = new Date()
    for (const { series, ...indicator } of INDICATORS) {
      await db.insert(macroIndicators).values({ ...indicator, asOf: now }).onConflictDoNothing()
    }
    logger.info(`✓ Seeded ${INDICATORS.length} macro indicators`)

    // ── Indicator Time Series ──────────────────────────────────────────────
    let dpCount = 0
    for (const { id: indicatorId, series } of INDICATORS) {
      for (let i = 0; i < series.length; i++) {
        const date = new Date(now)
        date.setMonth(date.getMonth() - i)
        await db
          .insert(indicatorDataPoints)
          .values({ id: `dp-${indicatorId}-${i}`, indicatorId, date, value: series[i] })
          .onConflictDoNothing()
        dpCount++
      }
    }
    logger.info(`✓ Seeded ${dpCount} indicator data points`)

    // ── Economic Events ────────────────────────────────────────────────────
    for (const { playerIds, ...event } of EVENTS) {
      await db.insert(economicEvents).values(event).onConflictDoNothing()
    }
    logger.info(`✓ Seeded ${EVENTS.length} economic events`)

    // ── Event ↔ Player joins ───────────────────────────────────────────────
    let epCount = 0
    for (const event of EVENTS) {
      for (const playerId of event.playerIds) {
        // Only insert if player exists in seeded list
        const playerExists = PLAYERS.find((p) => p.id === playerId)
        if (playerExists) {
          await db
            .insert(eventPlayers)
            .values({ eventId: event.id, playerId })
            .onConflictDoNothing()
          epCount++
        }
      }
    }
    logger.info(`✓ Seeded ${epCount} event-player links`)

    // ── Relationships ──────────────────────────────────────────────────────
    for (const rel of RELATIONSHIPS) {
      await db.insert(relationships).values(rel).onConflictDoNothing()
    }
    logger.info(`✓ Seeded ${RELATIONSHIPS.length} relationships`)

    logger.info('✅ Database seed completed successfully!')
    process.exit(0)
  } catch (err) {
    logger.error({ err }, '❌ Seed failed')
    process.exit(1)
  }
}

seed()