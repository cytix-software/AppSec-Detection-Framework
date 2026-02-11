import type { DataJson, MappingOut } from "../../utils/types";
import { ScannerParsingError } from "../errors/ScannerParsingError";
import { BaseScannerParser, type ParserInput, type ParseContext } from "./parser";

type NucleiClassification = {
  // Nuclei classification fields:
  "cwe-id"?: string[] | string | null;
  "cve-id"?: string[] | string | null;
  [k: string]: unknown;
};

type NucleiInfo = {
  name?: string;
  severity?: string;
  classification?: NucleiClassification | null;
  [k: string]: unknown;
};

type NucleiFinding = {
  // Nuclei JSON output fields
  "template-id"?: string;
  "template-path"?: string;
  "matcher-name"?: string | null;
  host?: string;
  port?: string | number;
  "matched-at"?: string;
  timestamp?: string; // ISO
  info?: NucleiInfo;
  [k: string]: unknown;
};

export const TEMPLATE_TO_CWES: Readonly<Record<string, readonly number[]>> = {
  "generic-path-traversal": [22],
  "CVE-2019-25213": [22],
  "CVE-2020-29227": [22],
  "CVE-2024-36527": [22],
  "CVE-2024-38816": [22],
  "CVE-2024-6049": [22],
  "CVE-2024-8752": [22],
  "CVE-2025-25231": [22],
  "CVE-2025-27222": [22],
  "CVE-2025-31125": [22],
  "CVE-2025-55748": [22],
  "CVE-2025-6204": [22],
  "CVE-2023-2059": [22, 23],
  "CVE-2024-3848": [22, 23],
  "CVE-2023-6266": [22, 23],
  "CVE-2023-6909": [22, 23],
  "CVE-2024-1483": [22, 23],
  "CVE-2024-2928": [22, 23],
  "CVE-2024-21136": [22, 23],
  "CVE-2024-32399": [22, 23],
  "CVE-2024-36857": [22, 23],
  "CVE-2024-45241": [22, 23],
  "CVE-2025-28367": [22, 23],
  "CVE-2025-47423": [22, 23],
  "CVE-2025-55169": [22, 23],
  "geovision-lfi": [22, 23],
  "alibaba-anyproxy-lfi": [22, 23],
  "ups-network-lfi": [22, 23],
  "webp-server-lfi": [22, 23],
  "tongda-path-traversal": [22, 23],
  "ecology-jqueryfiletree-traversal": [22, 23],
  "yonyou-fe-directory-traversal": [22, 23],
  "CVE-2019-2588": [22, 23],
  "wp-spot-premium-lfi": [22, 23],
  "CVE-2024-24809": [22, 23],
  "CVE-2025-52691": [22, 23],
  "CVE-2024-4841": [22, 73],
  "CVE-2021-28918": [73, 918],
  "CVE-2024-5827": [73, 89],
  "weaver-group-xml-sqli": [89],
  "CVE-2018-1000861": [77, 94],
  "CVE-2022-27924": [77],
  "cmdi-blind-oast-polyglot": [77, 78],
  "cmdi-ruby-open-rce": [77, 78],
  "CVE-2014-3206": [77, 78],
  "CVE-2018-1335": [77, 78],
  "CVE-2021-1472": [77, 78],
  "CVE-2021-31755": [77, 78],
  "CVE-2021-35395": [77, 78],
  "CVE-2021-41653": [77, 78],
  "CVE-2023-26035": [77, 78],
  "CVE-2023-26067": [77, 78],
  "CVE-2023-26802": [77, 78],
  "CVE-2024-10914": [77, 78],
  "CVE-2024-25852": [77, 78],
  "CVE-2024-29895": [77, 78],
  "CVE-2024-30568": [77, 78],
  "CVE-2024-3400": [77, 78],
  "CVE-2024-34257": [77, 78],
  "CVE-2024-38288": [77, 78],
  "CVE-2025-0107": [77, 78],
  "CVE-2025-45985": [77, 78],
  "header-command-injection": [77, 78],
  "maltrail-rce": [77, 78],
  "mirai-unknown-rce": [77, 78],
  "sar2html-rce": [77, 78],
  "CVE-2021-35394": [77, 78],
  "CVE-2025-47188": [77, 78],
  "CVE-2021-20617": [77, 78],
  "CVE-2020-8654": [77, 78],
  "CVE-2023-20198": [77, 78],
  "CVE-2025-4009": [77, 78],
  "CVE-2024-10443": [78],
  "CVE-2016-10108": [78],
  "CVE-2016-1555": [78],
  "CVE-2020-13117": [78],
  "CVE-2022-39986": [78],
  "CVE-2022-40624": [78],
  "CVE-2022-41800": [78],
  "CVE-2023-23333": [78],
  "CVE-2023-29084": [78],
  "CVE-2023-34960": [78],
  "CVE-2023-3710": [78],
  "CVE-2023-46574": [78],
  "CVE-2023-47218": [78],
  "CVE-2023-50917": [78],
  "CVE-2024-22729": [78],
  "CVE-2024-51228": [78],
  "CVE-2024-7029": [78],
  "CVE-2025-32813": [78],
  "CVE-2022-36804": [78, 88],
  "hongfan-ioffice-rce": [78, 89],
  "CVE-2002-1131": [79],
  "CVE-2005-3128": [79],
  "CVE-2019-9978": [79],
  "CVE-2022-29299": [79],
  "CVE-2004-0519": [79],
  "CVE-2005-4385": [79],
  "CVE-2018-2791": [79],
  "CVE-2018-3238": [79],
  "CVE-2022-29301": [79],
  "CVE-2022-29316": [79],
  "CVE-2025-0133": [79],
  "copyparty-xss": [79],
  "jorani-benjamin-xss": [79],
  "carrental-xss": [79],
  "woocommerce-pdf-invoices-xss": [79],
  "CVE-2021-29625": [79, 80],
  "geowebserver-xss": [79, 80],
  "p7-office-xss": [79, 80],
  "phpldapadmin-xss": [79, 80],
  "pmb-xss": [79, 80],
  "steve-xss": [79, 80],
  "tikiwiki-xss": [79, 80],
  "universal-media-xss": [79, 80],
  "webigniter-xss": [79, 80],
  "zzcms-register-xss": [79, 80],
  "retool-svg-xss": [79, 80],
  "vmware-cloud-xss": [79, 80],
  "404-to-301-xss": [79, 80],
  "avchat-video-chat-xss": [79, 80],
  "calameo-publications-xss": [79, 80],
  "checkout-fields-manager-xss": [79, 80],
  "clearfy-cache-xss": [79, 80],
  "curcy-xss": [79, 80],
  "modula-image-gallery-xss": [79, 80],
  "new-user-approve-xss": [79, 80],
  "shortpixel-image-optimizer-xss": [79, 80],
  "wordpress-wordfence-waf-bypass-xss": [79, 80],
  "wp-all-export-xss": [79, 80],
  "wp-code-snippets-xss": [79, 80],
  "wp-ellipsis-xss": [79, 80],
  "wptouch-xss": [79, 80],
  "CVE-2022-0087": [79, 601],
  "CVE-2024-41810": [79, 601],
  "CVE-2024-22120": [89],
  "sqli-error-based": [89],
  "time-based-sqli": [89],
  "CNVD-2017-06001": [89],
  "CNVD-2021-32799": [89],
  "CNVD-2021-33202": [89],
  "CNVD-2023-08743": [89],
  "CNVD-2023-12632": [89],
  "CNVD-2024-33023": [89],
  "CNVD-2024-38747": [89],
  "CVE-2018-8823": [89],
  "CVE-2019-2579": [89],
  "CVE-2021-41691": [89],
  "CVE-2020-12720": [89],
  "CVE-2021-39165": [89],
  "CVE-2022-3481": [89],
  "CVE-2023-3077": [89],
  "CVE-2024-11305": [89],
  "CVE-2024-13726": [89],
  "CVE-2024-1512": [89],
  "CVE-2024-1698": [89],
  "CVE-2024-27718": [89],
  "CVE-2024-2876": [89],
  "CVE-2024-29824": [89],
  "CVE-2024-31750": [89],
  "CVE-2024-32231": [89],
  "CVE-2024-32640": [89],
  "CVE-2024-32736": [89],
  "CVE-2024-32739": [89],
  "CVE-2024-33288": [89],
  "CVE-2024-3552": [89],
  "CVE-2024-36837": [89],
  "CVE-2024-38289": [89],
  "CVE-2024-3922": [89],
  "CVE-2024-39250": [89],
  "CVE-2024-4434": [89],
  "CVE-2024-4443": [89],
  "CVE-2024-5276": [89],
  "CVE-2024-5975": [89],
  "CVE-2024-6159": [89],
  "CVE-2024-6924": [89],
  "CVE-2024-6926": [89],
  "CVE-2024-6928": [89],
  "CVE-2025-57819": [89],
  "CVE-2025-6403": [89],
  "74cms-weixin-sqli": [89],
  "esafenet-netsecconfigajax-sqli": [89],
  "esafenet-noticeajax-sqli": [89],
  "hjsoft-hcm-sqli": [89],
  "hjsoft-hcm-tb-sqli": [89],
  "huatian-oa-sqli": [89],
  "jinhe-jc6-sqli": [89],
  "joomla-department-sqli": [89],
  "joomla-marvikshop-sqli": [89],
  "landray-eis-sqli": [89],
  "applezeed-sqli": [89],
  "aspcms-commentlist-sqli": [89],
  "azon-dominator-sqli": [89],
  "castel-digital-sqli": [89],
  "cloud-oa-system-sqli": [89],
  "cloudlog-system-sqli": [89],
  "cmseasy-crossall-sqli": [89],
  "cpas-managment-sqli": [89],
  "csz-cms-sqli": [89],
  "ecology-oa-file-sqli": [89],
  "elgg-sqli": [89],
  "enjoyrmis-sqli": [89],
  "erensoft-sqli": [89],
  "glodon-linkworks-sqli": [89],
  "groomify-sqli": [89],
  "halo-tism-sqli": [89],
  "hongfan-ioffice-sqli": [89],
  "huatian-oa8000-sqli": [89],
  "indonasia-toko-cms-sql": [89],
  "jeeplus-cms-resetpassword-sqli": [89],
  "opencart-core-sqli": [89],
  "phuket-cms-sqli": [89],
  "pingsheng-electronic-sqli": [89],
  "pmb-sqli": [89],
  "quick-cms-sqli": [89],
  "readymade-unilevel-sqli": [89],
  "sitemap-sql-injection": [89],
  "sound4-impact-auth-bypass": [89],
  "sound4-password-auth-bypass": [89],
  "stackposts-sqli": [89],
  "xhibiter-nft-sqli": [89],
  "yibao-sqli": [89],
  "zhixiang-oa-msglog-sqli": [89],
  "prestashop-apmarketplace-sqli": [89],
  "seeyon-oa-setextno-sqli": [89],
  "shiziyu-cms-apicontroller-sqli": [89],
  "tongda-insert-sqli": [89],
  "tongda-oa-swfupload-sqli": [89],
  "tongda-report-func-sqli": [89],
  "arcade-php-sqli": [89],
  "vbulletin-search-sqli": [89],
  "wanhu-documentedit-sqli": [89],
  "weaver-checkserver-sqli": [89],
  "weaver-e-cology-validate-sqli": [89],
  "weaver-ecology-getsqldata-sqli": [89],
  "weaver-ecology-hrmcareer-sqli": [89],
  "advanced-booking-calendar-sqli": [89],
  "contus-video-gallery-sqli": [89],
  "leaguemanager-sql-injection": [89],
  "notificationx-sqli": [89],
  "wp-adivaha-sqli": [89],
  "wp-autosuggest-sql-injection": [89],
  "wp-smart-manager-sqli": [89],
  "wp-statistics-sqli": [89],
  "zero-spam-sql-injection": [89],
  "chanjet-gnremote-sqli": [89],
  "chanjet-tplus-checkmutex-sqli": [89],
  "chanjet-tplus-ufida-sqli": [89],
  "yonyou-grp-u8-xxe": [89],
  "yonyou-u8-crm-sqli": [89],
  "yonyou-u8-crm-tb-sqli": [89],
  "yonyou-u8-sqli": [89],
  "yonyou-ufida-cloud-sqli": [89],
  "thinkphp-509-information-disclosure": [89, 209],
  "CVE-2024-47062": [89, 287],
  "user-management-system-sqli": [89, 287],
  "realor-gwt-system-sqli": [89, 287],
  "CVE-2025-64525": [284],
  "CVE-2025-8085": [284, 918],
  "CVE-2021-22911": [306],
  "podcast-generator-ssrf": [91, 918],
  "CVE-2023-3722": [94],
  "CVE-2024-9264": [94],
  "python-code-injection": [94, 95],
  "CVE-2025-52207": [434],
  "CVE-2025-64095": [434],
  "CVE-2022-41352": [434, 829],
  "CVE-2021-28854": [532, 538],
  "file-disable-directory-listing": [548, 552],
  "CVE-2020-35234": [548, 552],
  "CVE-2023-37599": [548, 552],
  "CVE-2024-33605": [548, 552],
  "backup-directory-listing": [548, 552],
  "dir-listing": [548, 552],
  "directory-listing": [548, 552],
  "directory-listing-no-host-header": [548, 552],
  "drupal-directory-listing": [548, 552],
  "glpi-directory-listing": [548, 552],
  "jetty-directory-listing": [548, 552],
  "sap-directory-listing": [548, 552],
  "tomcat-directory-listing": [548, 552],
  "node-ecstatic-listing": [548, 552],
  "lean-value-listing": [548, 552],
  "wordpress-bbpress-plugin-listing": [548, 552],
  "wordpress-directory-listing": [548, 552],
  "wordpress-elementor-plugin-listing": [548, 552],
  "wordpress-gtranslate-plugin-listing": [548, 552],
  "wordpress-redirection-plugin-listing": [548, 552],
  "wp-123contactform-plugin-listing": [548, 552],
  "wp-altair-listing": [548, 552],
  "wordpress-popup-listing": [548, 552],
  "wordpress-super-forms": [548, 552],
  "generic-db": [552],
  "open-redirect": [601],
  "open-redirect-bypass": [601],
  "CVE-2004-1965": [601],
  "CVE-2005-3634": [601],
  "CVE-2008-7269": [601],
  "CVE-2009-0347": [601],
  "CVE-2009-5020": [601],
  "CVE-2010-1586": [601],
  "CVE-2011-5252": [601],
  "CVE-2012-4032": [601],
  "CVE-2012-4982": [601],
  "CVE-2012-5321": [601],
  "CVE-2012-6499": [601],
  "CVE-2013-2248": [601],
  "CVE-2015-5461": [601],
  "CVE-2015-7823": [601],
  "CVE-2016-3978": [601],
  "CVE-2023-6786": [601],
  "CVE-2024-0250": [601],
  "CVE-2024-0337": [601],
  "CVE-2024-10812": [601],
  "CVE-2024-10908": [601],
  "CVE-2024-11044": [601],
  "CVE-2024-12760": [601],
  "CVE-2024-8021": [601],
  "pkp-lib-open-redirect": [601],
  "brandfolder-open-redirect": [601],
  "wp-prostore-open-redirect": [601],
  "wp-touch-redirect": [601],
  "wp-upward-theme-redirect": [601],
  "CVE-2025-27888": [601, 918],
  "CVE-2022-3980": [611, 918],
  "jamf-blind-xxe": [611, 918],
  "cookies-without-secure": [614],
  "CVE-2024-3273": [798],
  "CVE-2019-6799": [829, 830],
  "blind-ssrf": [918],
  "response-ssrf": [918],
  "CVE-2014-4210": [918],
  "CVE-2017-18598": [918],
  "CVE-2018-1000600": [918],
  "CVE-2018-3167": [918],
  "CVE-2022-3590": [918],
  "CVE-2023-41763": [918],
  "CVE-2023-49785": [918],
  "CVE-2023-5830": [918],
  "CVE-2024-1183": [918],
  "CVE-2024-27564": [918],
  "CVE-2024-29030": [918],
  "CVE-2024-6586": [918],
  "CVE-2024-6587": [918],
  "CVE-2024-6922": [918],
  "CVE-2025-34028": [918],
  "CVE-2025-4123": [918],
  "CVE-2025-54249": [918],
  "CVE-2025-61882": [918],
  "ssrf-via-proxy": [918],
  "targa-camera-ssrf": [918],
  "linkerd-ssrf-detection": [918],
  "portal-api-ssrf": [918],
  "ssrf-via-oauth-misconfig": [918],
  "titiler-ssrf": [918],
  "tls-sni-proxy": [918],
  "amazon-ec2-ssrf": [918],
  "xmlrpc-pingback-ssrf": [918],
  "gradio-ssrf": [918],
  "brightsign-dsdws-ssrf": [918],
  "digital-ocean-ssrf": [918],
  "hasura-graphql-ssrf": [918],
  "microstrategy-ssrf": [918],
  "webpagetest-ssrf": [918],
  "splash-render-ssrf": [918],
  "ueditor-ssrf": [918],
  "vmware-vcenter-ssrf": [918],
  "w3c-total-cache-ssrf": [918],
  "wp-jetpack-ssrf": [918],
  "wp-under-construction-ssrf": [918],
  "wordpress-ssrf-oembed": [918],
  "wp-xmlrpc-pingback-detection": [918],
  "zzzcms-ssrf": [918],
  "avtech-dvr-ssrf": [918],
  "cookies-without-httponly": [1004],
  "missing-cookie-samesite-strict": [1275, 693],
  "codeigniter-env": [200, 219, 552],
  "generic-env": [200, 522, 552, 219],
  "sendgrid-env": [200, 522, 552, 219],
  "hikvision-env": [200, 219, 306],
  "javascript-env": [200, 219, 552],
  "javascript-env-config": [200, 219, 552],
  "laravel-env": [200, 219, 552, 522],
  "node-express-dev-env" : [538, 200],
  "wordpress-wp-env-exposure" : [200, 219, 552],
  "springboot-env" : [200, 219, 552],
  "aspnetcore-dev-env" : [200, 219, 552],
  "info-cgi-env-leak" : [200, 538, 219, 552],
  "nextjs-vite-public-env" : [200, 219, 552],
  "reactapp-env-js" : [200, 219, 552],
  "apache-spark-env": [200, 219, 552],
  "missing-sri": [494, 345, 353],
  "rockmongo-xss": [79, 80],
  "rockmongo-default-login": [798, 522, 259],
  "CVE-2020-23015": [79],
  "self-signed-ssl": [295],
  "credit-card-number-detect": [359, 200],
  "credentials-disclosure": [200, 522],
  "package-json": [200],
  "jolokia-tomcat-creds-leak": [200, 522, 798],
  "tomcat-snoop-servlet-exposed": [200, 497],
  "tomcat-stacktraces": [200, 209],
  "tomcat-cookie-exposed": [200, 539, 614],
  "apache-tomcat-manager-path-normalization": [22, 23, 425, 284],
  "tomcat-examples-login": [200, 1188],
  "wp-super-cache": [200],
  "wp-super-cache-fpd": [209, 200],
  "wp-superstorefinder-misconfig": [306, 862, 200],
  "xss-fuzz": [79, 80],
  "waf-fuzz": [200],
  "prestashop-module-fuzz": [200],
  "cache-poisoning-fuzz": [525],
  "config-json-exposure-fuzz": [200],
  "linux-lfi-fuzz": [22, 23],
  "windows-lfi-fuzz": [22, 23],
  "linux-lfi-fuzzing": [22, 23],
  "windows-lfi-fuzzing": [22, 23],
  "kingdee-eas-directory-traversal": [22, 23],
  "wooyun-path-traversal": [22, 23],
  "erp-nc-directory-traversal": [22, 23],
  "ecology-springframework-directory-traversal": [22, 23],
  "ecology-filedownload-directory-traversal": [22, 23],
  "tpshop-directory-traversal": [22, 23],
  "taiwanese-travel-lfi": [22, 23],
  "pmb-directory-traversal": [22, 23],
  "nginx-merge-slashes-path-traversal": [22, 23],
  "natshell-path-traversal": [22, 23],
  "flir-path-traversal": [22, 23],
  "elFinder-path-traversal": [22, 23],
  "digitalrebar-traversal": [22, 23],
  "finereport-path-traversal": [22, 23],
  "nginx-api-traversal": [22, 23],
  "api-travisci": [200],
  "travisci-access-token": [200, 522],
  "travis-ci-disclosure": [200]
} as const;

export function templateIdToCwes(templateId: string): readonly number[] {
  return TEMPLATE_TO_CWES[templateId] ?? [];
}

function parseEpochFromIsoOrFallback(iso?: string, fallbackEpoch?: number): number | undefined {
  if (!iso) return fallbackEpoch;
  const ms = Date.parse(iso);
  if (!Number.isFinite(ms)) return fallbackEpoch;
  return Math.floor(ms / 1000);
}

/**
 * Normalizes:
 *  - "cwe-200" -> 200
 *  - "CWE-22"  -> 22
 *  - "22"      -> 22
 */
function normalizeCweId(raw: unknown): number | null {
  if (raw == null) return null;

  if (typeof raw === "string") {
    const m = raw.match(/(\d+)/);
    if (!m) return null;
    const n = Number(m[1]);
    return Number.isFinite(n) && n > 0 ? n : null;
  }

  return null;
}

export class NucleiJsonParser extends BaseScannerParser {
  constructor() {
    super("Nuclei", "Nuclei imports are best-effort mappings with CWEs derived from template metadata and local mappings, review results carefully.");
  }

  public async _parse(
    input: ParserInput,
    data: DataJson,
    ctx?: ParseContext
  ): Promise<MappingOut> {
    const raw = await this.loadText(input);
    let findings: NucleiFinding[] = [];
    const trimmed = raw.trim();
    const scanProfile = ctx?.scanProfile ?? this.scannerKey;

    if (trimmed.startsWith("[")) {
      try {
        findings = JSON.parse(trimmed) as NucleiFinding[];
      } catch (e) {
        //If no findings, throw error
        throw new ScannerParsingError("Failed to parse Nuclei JSON report. Invalid JSON.");
      }
    } else {
      findings = []; //if not expected format, can't parse findings
    }

    //If no findings, throw parsing error
    if (findings.length === 0) {
      throw new ScannerParsingError("Failed to parse Nuclei JSON report. Missing findings.");
    }

    const expectedByTest = this.buildExpectedCWEsByTest(data);
    const detectedByTest = new Map<string, Set<number>>();
    // infer updatedAt from the artifact (latest timestamp)
    let inferredUpdatedAt: number | undefined = undefined;
    let cwes: number[] = [];

    for (const f of findings) {
      const ts = parseEpochFromIsoOrFallback(f.timestamp);
      if (ts != null) {
        inferredUpdatedAt = inferredUpdatedAt == null ? ts : Math.max(inferredUpdatedAt, ts);
      }

      const testName = this.portToTestName(f.port);
      if (!testName) continue;

      if (!detectedByTest.has(testName)) detectedByTest.set(testName, new Set<number>());

      // 1) Prefer CWE IDs embedded in nuclei output
      const cls = f.info?.classification ?? null;
      const cweField = cls ? (cls as any)["cwe-id"] : null;

      let cwesSet = new Set<number>();
      if (Array.isArray(cweField)) {
        for (const rawCwe of cweField) {
          const n = normalizeCweId(rawCwe);
          if (n != null) cwesSet.add(n);
        }
      } else {
        const n = normalizeCweId(cweField);
        if (n != null) cwesSet.add(n);
      }

      // 2) Also use local mapping in case nuclei didn't provide CWE IDs
      const templateId = f["template-id"] ?? "";
      const local = templateId ? templateIdToCwes(templateId) : [];
      for (const x of local ?? []) {
        if (Number.isFinite(x) && x > 0) cwesSet.add(x);
      }

      //Check for cases of 'default-login' or 'credentials' present
      if (templateId.includes("default-login")) {
        cwesSet.add(798); //CWE-798: Use of Hard-coded Credentials
        cwesSet.add(522); //CWE-522: Insufficiently Protected Credentials
        cwesSet.add(259); //CWE-259: Use of Weak Password Recovery Mechanism
      }else if (templateId.includes("credentials")) {
        cwesSet.add(200); //CWE-200: Information Exposure
        cwesSet.add(522); //CWE-522: Insufficiently Protected Credentials
      }

      //Add to detected
      const detectedSet = detectedByTest.get(testName)!;
      cwes = Array.from(cwesSet);
      for (const cwe of cwes) {
        detectedSet.add(cwe);
      }
    }

    const updatedAt = ctx?.updatedAt ?? inferredUpdatedAt ?? this.nowEpoch();

    const testUniverse = (ctx?.expectedTests?.length
        ? ctx.expectedTests
        : Array.from(detectedByTest.keys())
        ).filter((t) => expectedByTest.has(t)); // keep it aligned to framework tests

    const testsOut = Array.from(new Set(testUniverse))
    .sort(this.sortTestNames)
    .map((test) => {
        const expected = expectedByTest.get(test) ?? new Set<number>();
        const detectedAll = detectedByTest.get(test) ?? new Set<number>(); // empty if no findings

        const detectedCWEs = Array.from(detectedAll)
        .filter((c) => expected.has(c))
        .sort((a, b) => a - b);

        const undetectedCWEs = Array.from(expected)
        .filter((c) => !detectedAll.has(c))
        .sort((a, b) => a - b);

        return { test, detectedCWEs, undetectedCWEs, updatedAt };
    });

    const out: MappingOut = {
      [this.scannerKey]: {
        scanProfile,
        tests: testsOut,
      },
    };

    return out;
  }
}