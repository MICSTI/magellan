// name for all files that should be pre-fetched
const PRECACHE = 'magellan-v26';

// maximum time for fulfilling a network request
const NETWORK_REQUEST_MAX_TIME_IN_MILLISECONDS = 6000;

// URL prefixes that should always be fetched from network
const ALWAYS_NETWORK_URL_PREFIXES = [
    '/api'
];

// list of local resources we always want to be cached
const PRECACHE_URLS = [
    // CSS
    '/lib/fonts/OpenSans/OpenSans.css',
    '/lib/angular/ngprogress.css',
    '/lib/flags/css/flag-icon.min.css',
    '/dist/styles/styles.css',

    // fonts
    '/lib/fonts/OpenSans/OpenSans_latin.woff2',

    // JS
    '/dist/scripts/external.js',
    '/dist/scripts/script.js',

    // HTML
    '/dist/views/index.html',

    '/dist/views/partials/about.partial.html',
    '/dist/views/partials/countries.partial.html',
    '/dist/views/partials/countries-detail.partial.html',
    '/dist/views/partials/error.partial.html',
    '/dist/views/partials/faq.partial.html',
    '/dist/views/partials/highscore.partial.html',
    '/dist/views/partials/home.partial.html',
    '/dist/views/partials/login.partial.html',
    '/dist/views/partials/password-change.partial.html',
    '/dist/views/partials/password-forgot.partial.html',
    '/dist/views/partials/password-reset.partial.html',
    '/dist/views/partials/quiz.partial.html',
    '/dist/views/partials/register.partial.html',
    '/dist/views/partials/settings.partial.html',

    '/dist/views/templates/map.template.html',
    '/dist/views/templates/password-requirements.template.html',
    '/dist/views/templates/quiz-directive.template.html',
    '/dist/views/templates/sortable-list.template.html',
    '/dist/views/templates/value-revealer.template.html',

    // images
    '/dist/images/world.svg',
    '/dist/images/fb_login_button.png',
    '/dist/images/btn_google_signin_light_normal_web.png',

    '/dist/images/loading.gif',

    '/lib/flags/flags/4x3/af.svg',
    '/lib/flags/flags/4x3/eg.svg',
    '/lib/flags/flags/4x3/al.svg',
    '/lib/flags/flags/4x3/dz.svg',
    '/lib/flags/flags/4x3/ad.svg',
    '/lib/flags/flags/4x3/ao.svg',
    '/lib/flags/flags/4x3/ag.svg',
    '/lib/flags/flags/4x3/gq.svg',
    '/lib/flags/flags/4x3/ar.svg',
    '/lib/flags/flags/4x3/am.svg',
    '/lib/flags/flags/4x3/az.svg',
    '/lib/flags/flags/4x3/et.svg',
    '/lib/flags/flags/4x3/au.svg',
    '/lib/flags/flags/4x3/bs.svg',
    '/lib/flags/flags/4x3/bh.svg',
    '/lib/flags/flags/4x3/bd.svg',
    '/lib/flags/flags/4x3/bb.svg',
    '/lib/flags/flags/4x3/be.svg',
    '/lib/flags/flags/4x3/bz.svg',
    '/lib/flags/flags/4x3/bj.svg',
    '/lib/flags/flags/4x3/bt.svg',
    '/lib/flags/flags/4x3/bo.svg',
    '/lib/flags/flags/4x3/ba.svg',
    '/lib/flags/flags/4x3/bw.svg',
    '/lib/flags/flags/4x3/br.svg',
    '/lib/flags/flags/4x3/bn.svg',
    '/lib/flags/flags/4x3/bg.svg',
    '/lib/flags/flags/4x3/bf.svg',
    '/lib/flags/flags/4x3/bi.svg',
    '/lib/flags/flags/4x3/cl.svg',
    '/lib/flags/flags/4x3/cn.svg',
    '/lib/flags/flags/4x3/cr.svg',
    '/lib/flags/flags/4x3/dk.svg',
    '/lib/flags/flags/4x3/de.svg',
    '/lib/flags/flags/4x3/dm.svg',
    '/lib/flags/flags/4x3/do.svg',
    '/lib/flags/flags/4x3/dj.svg',
    '/lib/flags/flags/4x3/ec.svg',
    '/lib/flags/flags/4x3/sv.svg',
    '/lib/flags/flags/4x3/ci.svg',
    '/lib/flags/flags/4x3/er.svg',
    '/lib/flags/flags/4x3/ee.svg',
    '/lib/flags/flags/4x3/fj.svg',
    '/lib/flags/flags/4x3/fi.svg',
    '/lib/flags/flags/4x3/fr.svg',
    '/lib/flags/flags/4x3/ga.svg',
    '/lib/flags/flags/4x3/gm.svg',
    '/lib/flags/flags/4x3/ge.svg',
    '/lib/flags/flags/4x3/gh.svg',
    '/lib/flags/flags/4x3/gd.svg',
    '/lib/flags/flags/4x3/gr.svg',
    '/lib/flags/flags/4x3/gb.svg',
    '/lib/flags/flags/4x3/gt.svg',
    '/lib/flags/flags/4x3/gn.svg',
    '/lib/flags/flags/4x3/gw.svg',
    '/lib/flags/flags/4x3/gy.svg',
    '/lib/flags/flags/4x3/ht.svg',
    '/lib/flags/flags/4x3/hn.svg',
    '/lib/flags/flags/4x3/in.svg',
    '/lib/flags/flags/4x3/id.svg',
    '/lib/flags/flags/4x3/iq.svg',
    '/lib/flags/flags/4x3/ir.svg',
    '/lib/flags/flags/4x3/ie.svg',
    '/lib/flags/flags/4x3/is.svg',
    '/lib/flags/flags/4x3/il.svg',
    '/lib/flags/flags/4x3/it.svg',
    '/lib/flags/flags/4x3/jm.svg',
    '/lib/flags/flags/4x3/jp.svg',
    '/lib/flags/flags/4x3/ye.svg',
    '/lib/flags/flags/4x3/jo.svg',
    '/lib/flags/flags/4x3/kh.svg',
    '/lib/flags/flags/4x3/cm.svg',
    '/lib/flags/flags/4x3/ca.svg',
    '/lib/flags/flags/4x3/cv.svg',
    '/lib/flags/flags/4x3/kz.svg',
    '/lib/flags/flags/4x3/qa.svg',
    '/lib/flags/flags/4x3/ke.svg',
    '/lib/flags/flags/4x3/kg.svg',
    '/lib/flags/flags/4x3/ki.svg',
    '/lib/flags/flags/4x3/co.svg',
    '/lib/flags/flags/4x3/km.svg',
    '/lib/flags/flags/4x3/cg.svg',
    '/lib/flags/flags/4x3/cd.svg',
    '/lib/flags/flags/4x3/xk.svg',
    '/lib/flags/flags/4x3/hr.svg',
    '/lib/flags/flags/4x3/cu.svg',
    '/lib/flags/flags/4x3/kw.svg',
    '/lib/flags/flags/4x3/la.svg',
    '/lib/flags/flags/4x3/ls.svg',
    '/lib/flags/flags/4x3/lv.svg',
    '/lib/flags/flags/4x3/lb.svg',
    '/lib/flags/flags/4x3/lr.svg',
    '/lib/flags/flags/4x3/ly.svg',
    '/lib/flags/flags/4x3/li.svg',
    '/lib/flags/flags/4x3/lt.svg',
    '/lib/flags/flags/4x3/lu.svg',
    '/lib/flags/flags/4x3/mg.svg',
    '/lib/flags/flags/4x3/mw.svg',
    '/lib/flags/flags/4x3/my.svg',
    '/lib/flags/flags/4x3/mv.svg',
    '/lib/flags/flags/4x3/ml.svg',
    '/lib/flags/flags/4x3/mt.svg',
    '/lib/flags/flags/4x3/ma.svg',
    '/lib/flags/flags/4x3/mh.svg',
    '/lib/flags/flags/4x3/mr.svg',
    '/lib/flags/flags/4x3/mu.svg',
    '/lib/flags/flags/4x3/mk.svg',
    '/lib/flags/flags/4x3/mx.svg',
    '/lib/flags/flags/4x3/fm.svg',
    '/lib/flags/flags/4x3/md.svg',
    '/lib/flags/flags/4x3/mc.svg',
    '/lib/flags/flags/4x3/mn.svg',
    '/lib/flags/flags/4x3/me.svg',
    '/lib/flags/flags/4x3/mz.svg',
    '/lib/flags/flags/4x3/mm.svg',
    '/lib/flags/flags/4x3/na.svg',
    '/lib/flags/flags/4x3/nr.svg',
    '/lib/flags/flags/4x3/np.svg',
    '/lib/flags/flags/4x3/nz.svg',
    '/lib/flags/flags/4x3/ni.svg',
    '/lib/flags/flags/4x3/nl.svg',
    '/lib/flags/flags/4x3/ne.svg',
    '/lib/flags/flags/4x3/ng.svg',
    '/lib/flags/flags/4x3/kp.svg',
    '/lib/flags/flags/4x3/no.svg',
    '/lib/flags/flags/4x3/om.svg',
    '/lib/flags/flags/4x3/at.svg',
    '/lib/flags/flags/4x3/pk.svg',
    '/lib/flags/flags/4x3/ps.svg',
    '/lib/flags/flags/4x3/pw.svg',
    '/lib/flags/flags/4x3/pa.svg',
    '/lib/flags/flags/4x3/pg.svg',
    '/lib/flags/flags/4x3/py.svg',
    '/lib/flags/flags/4x3/pe.svg',
    '/lib/flags/flags/4x3/ph.svg',
    '/lib/flags/flags/4x3/pl.svg',
    '/lib/flags/flags/4x3/pt.svg',
    '/lib/flags/flags/4x3/rw.svg',
    '/lib/flags/flags/4x3/ro.svg',
    '/lib/flags/flags/4x3/ru.svg',
    '/lib/flags/flags/4x3/sb.svg',
    '/lib/flags/flags/4x3/zm.svg',
    '/lib/flags/flags/4x3/ws.svg',
    '/lib/flags/flags/4x3/sm.svg',
    '/lib/flags/flags/4x3/st.svg',
    '/lib/flags/flags/4x3/sa.svg',
    '/lib/flags/flags/4x3/se.svg',
    '/lib/flags/flags/4x3/ch.svg',
    '/lib/flags/flags/4x3/sn.svg',
    '/lib/flags/flags/4x3/rs.svg',
    '/lib/flags/flags/4x3/sc.svg',
    '/lib/flags/flags/4x3/sl.svg',
    '/lib/flags/flags/4x3/zw.svg',
    '/lib/flags/flags/4x3/sg.svg',
    '/lib/flags/flags/4x3/sk.svg',
    '/lib/flags/flags/4x3/si.svg',
    '/lib/flags/flags/4x3/so.svg',
    '/lib/flags/flags/4x3/es.svg',
    '/lib/flags/flags/4x3/lk.svg',
    '/lib/flags/flags/4x3/kn.svg',
    '/lib/flags/flags/4x3/lc.svg',
    '/lib/flags/flags/4x3/vc.svg',
    '/lib/flags/flags/4x3/za.svg',
    '/lib/flags/flags/4x3/sd.svg',
    '/lib/flags/flags/4x3/kr.svg',
    '/lib/flags/flags/4x3/ss.svg',
    '/lib/flags/flags/4x3/sr.svg',
    '/lib/flags/flags/4x3/sz.svg',
    '/lib/flags/flags/4x3/sy.svg',
    '/lib/flags/flags/4x3/tj.svg',
    '/lib/flags/flags/4x3/tz.svg',
    '/lib/flags/flags/4x3/tw.svg',
    '/lib/flags/flags/4x3/th.svg',
    '/lib/flags/flags/4x3/tl.svg',
    '/lib/flags/flags/4x3/tg.svg',
    '/lib/flags/flags/4x3/to.svg',
    '/lib/flags/flags/4x3/tt.svg',
    '/lib/flags/flags/4x3/td.svg',
    '/lib/flags/flags/4x3/cz.svg',
    '/lib/flags/flags/4x3/tn.svg',
    '/lib/flags/flags/4x3/tr.svg',
    '/lib/flags/flags/4x3/tm.svg',
    '/lib/flags/flags/4x3/tv.svg',
    '/lib/flags/flags/4x3/ug.svg',
    '/lib/flags/flags/4x3/ua.svg',
    '/lib/flags/flags/4x3/hu.svg',
    '/lib/flags/flags/4x3/uy.svg',
    '/lib/flags/flags/4x3/uz.svg',
    '/lib/flags/flags/4x3/vu.svg',
    '/lib/flags/flags/4x3/va.svg',
    '/lib/flags/flags/4x3/ve.svg',
    '/lib/flags/flags/4x3/ae.svg',
    '/lib/flags/flags/4x3/us.svg',
    '/lib/flags/flags/4x3/vn.svg',
    '/lib/flags/flags/4x3/by.svg',
    '/lib/flags/flags/4x3/cf.svg',
    '/lib/flags/flags/4x3/cy.svg'
];

// method to fetch something from the network
const fetchFromNetwork = (request, timeout) => {
    return new Promise((fulfil, reject) => {
        const timeoutId = setTimeout(reject, timeout);

        fetch(request)
            .then(response => {
                clearTimeout(timeoutId);
                fulfil(response);
            }, reject);
    });
};

// the install handler takes care of precaching the resources we always need
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(PRECACHE)
            .then(cache => cache.addAll(PRECACHE_URLS))
            .then(self.skipWaiting())
    );
});

// the activate handler takes care of cleaning up old caches
self.addEventListener('activate', event => {
    const currentCaches = [PRECACHE];

    event.waitUntil(
        caches.keys().then(cacheNames => {
            return cacheNames.filter(cacheName => !currentCaches.includes(cacheName));
        }).then(cachesToDelete => {
            return Promise.all(cachesToDelete.map(cacheToDelete => {
                return caches.delete(cacheToDelete);
            }));
        }).then(() => self.clients.claim())
    );
});

// the fetch handler serves responses for same-origin responses from a cache
self.addEventListener('fetch', event => {
    const origin = self.location.origin;

    // skip cross-origin requests
    if (event.request.url.startsWith(origin)) {
        const routeWithoutOrigin = event.request.url.substr(origin.length);

        // determine if the request URL starts with one that must always be served from the network
        const fetchDirectlyFromNetwork = ALWAYS_NETWORK_URL_PREFIXES.filter(url => routeWithoutOrigin.startsWith(url)).length > 0;

        if (fetchDirectlyFromNetwork) {
            console.log('going directly to network for', event.request.url);
            event.respondWith(fetchFromNetwork(event.request, NETWORK_REQUEST_MAX_TIME_IN_MILLISECONDS).catch(err => console.error('failed to fetch', err)));
        } else {
            event.respondWith(
                caches.match(event.request)
                    .then(cachedResponse => {
                        if (cachedResponse) {
                            console.log('serving from cache', event.request.url);
                            return cachedResponse;
                        }

                        console.log('serving from network', event.request.url);
                        return fetchFromNetwork(event.request, NETWORK_REQUEST_MAX_TIME_IN_MILLISECONDS).catch(err => console.error('failed to fetch', err));
                    })
                    .catch(err => {
                        console.error(err);
                    })
            );
        }
    }
});