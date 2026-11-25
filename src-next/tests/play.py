import random, sys, json
from playwright.sync_api import sync_playwright
U='http://localhost:8090/next/index.html'
seed=int(sys.argv[1]) if len(sys.argv)>1 else 1
shots='--shots' in sys.argv
rnd=random.Random(seed)
errors=[]; log=[]
with sync_playwright() as p:
    b=p.chromium.launch(); pg=b.new_page(viewport={'width':390,'height':844})
    pg.on('pageerror',lambda e: errors.append(str(e)))
    pg.on('console',lambda m: m.type=='error' and 'Failed to load' not in m.text and 'fonts' not in m.text and errors.append('console '+m.text))
    pg.goto(U); pg.wait_for_timeout(500)
    pg.evaluate("localStorage.clear()"); pg.reload(); pg.wait_for_timeout(300)
    def shot(n):
        if shots: pg.screenshot(path=f'/var/tmp/eh-next/shots/{n}.png', full_page=True)
    shot('00_title')
    pg.click('[data-a=new]'); pg.wait_for_timeout(200)
    steps=0; seen=set(); battles=0
    while steps<600:
        steps+=1
        st=pg.evaluate("({screen:S.screen, scene:S.scene, season:S.season, flights:S.flights, hp:S.hp})")
        scr=st['screen']
        if scr=='scene':
            if st['scene'] not in seen:
                seen.add(st['scene']); 
                if shots: shot('sc_'+st['scene'])
            ch=pg.locator('.choice:not([disabled])'); k=ch.count()
            # prefer non-refund options
            idx=rnd.randrange(k)
            txt=ch.nth(idx).inner_text()
            if 'Not now' in txt or 'not enough' in txt or 'Leave them' in txt: idx=0
            ch.nth(idx).click(); pg.wait_for_timeout(60)
        elif scr=='out':
            pg.click('[data-a=outnext]'); pg.wait_for_timeout(40)
        elif scr=='create':
            if shots: shot('01_create')
            for key in ['color','horns','hide','tail','element']:
                opts=pg.locator(f'[data-a=look][data-k={key}]'); opts.nth(rnd.randrange(opts.count())).click(); pg.wait_for_timeout(30)
            pg.fill('#name-in','Testwing'); pg.click('[data-a=hatch]'); pg.wait_for_timeout(80)
        elif scr=='battle':
            battles+=1
            if shots and battles in (1,8,40): shot(f'battle_{battles}')
            busy=pg.evaluate("S.battle && S.battle.busy")
            if busy: pg.wait_for_timeout(200); continue
            heat=pg.evaluate("S.battle.me.heat")
            acts=pg.locator('[data-a=act]:not([disabled])')
            names=[acts.nth(i).get_attribute('data-v') for i in range(acts.count())]
            pick=None
            for pref in ['devour','struggle']:
                if pref in names: pick=pref; break
            if not pick:
                if 'breath' in names: pick='breath'
                elif 'tail' in names and rnd.random()<.7: pick='tail'
                elif 'guard' in names and rnd.random()<.4: pick='guard'
                else: pick='claw' if 'claw' in names else names[0]
            pg.click(f'[data-a=act][data-v={pick}]'); pg.wait_for_timeout(150)
            for _ in range(40):
                if not pg.evaluate("S.battle && S.battle.busy"): break
                pg.wait_for_timeout(150)
        elif scr=='map':
            if shots and ('map%d'%st['season']) not in seen: seen.add('map%d'%st['season']); shot('map_%d'%st['season'])
            evs=pg.evaluate("Object.keys(PLACES).filter(id=>eventAt(id))")
            # sometimes visit lair to buy
            if rnd.random()<.3:
                pg.click('[data-a=sel][data-v=lair]'); pg.click('[data-a=lair]'); pg.wait_for_timeout(50)
                if shots and 'lair' not in seen: seen.add('lair'); shot('lair')
                for u in ['vents','pool','forge']:
                    bb=pg.locator(f'[data-a=buy][data-v={u}]:not([disabled])')
                    if bb.count(): bb.click(); pg.wait_for_timeout(30)
                pg.click('[data-a=map]'); pg.wait_for_timeout(50); continue
            if evs and st['flights']>0:
                t=rnd.choice(evs); pg.click(f'[data-a=sel][data-v={t}]'); pg.click('[data-a=fly]'); pg.wait_for_timeout(60)
            else:
                pg.click('[data-a=endseason]'); pg.click('[data-a=endseason]'); pg.wait_for_timeout(60)
        elif scr=='lair':
            pg.click('[data-a=map]')
        elif scr=='report':
            if shots: shot('report_%d'%st['season'])
            pg.click('[data-a=nextseason]'); pg.wait_for_timeout(60)
        elif scr=='end':
            shot('zz_end'); break
        else:
            log.append('unknown '+scr); break
    final=pg.evaluate("({screen:S.screen, hope:S.hope, dread:S.dread, wild:S.wild, gold:S.gold, places:S.places, stage:S.stage, hp:S.hp, max:S.maxHp, flags:S.flags, done:Object.keys(S.done)})")
    b.close()
print(json.dumps({'seed':seed,'steps':steps,'battles':battles,'final':final,'errors':errors[:5],'log':log}))
