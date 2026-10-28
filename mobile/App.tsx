import React, {useEffect, useState} from 'react';
import {ActivityIndicator, Alert, Pressable, SafeAreaView, ScrollView, StatusBar, StyleSheet, Text, TextInput, View, Image, ImageBackground} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import {Directory, File, Paths} from 'expo-file-system';

type Tab = 'home' | 'swing' | 'stats' | 'practice' | 'profile';
type Player = {name: string; hand: 'right' | 'left'; experience: string; units: 'yards' | 'meters'; handicap: string};
type Club = {id: string; name: string; active: boolean};
type Hole = {number: number; par: number; strokes: number | null};
type Round = {id: string; course: string; holes: Hole[]; finished: boolean; date: string};
type Swing = {id: string; date: string; clubId: string; view: 'Face-on' | 'Down-the-line'; videoUri: string};
type PracticeSession = {id: string; drill: string; date: string; reps: number};
type Data = {player: Player | null; clubs: Club[]; rounds: Round[]; swings: Swing[]; practiceSessions: PracticeSession[]};
const KEY = '@fairways/mobile/v1';
const initial: Data = {player: null, clubs: [], rounds: [], swings: [], practiceSessions: []};
const K = {bg:'#0b0d0f',surface:'#1a201e',card:'#1d2421',card2:'#26302b',text:'#f4f7f4',muted:'#8c9690',subtle:'#728079',green:'#63d471',line:'#3b4540',ink:'#08110a',danger:'#e57e82'};
const id = () => String(Date.now()) + '-' + Math.random().toString(36).slice(2,8);
const formatDate = (iso: string) => new Date(iso).toLocaleDateString();
const firstName = (value: string) => value.trim().split(/\s+/)[0] || 'Golfer';

function Label({children}: {children: React.ReactNode}) {return <Text style={s.label}>{children}</Text>;}
function Body({children}: {children: React.ReactNode}) {return <Text style={s.body}>{children}</Text>;}
function Title({eyebrow,title,detail}: {eyebrow:string;title:string;detail?:string}) {
  return <View style={{marginBottom:20}}><Label>{eyebrow}</Label><Text style={s.pageTitle}>{title}</Text>{detail ? <Body>{detail}</Body> : null}</View>;
}
function Card({children,highlight=false}: {children:React.ReactNode;highlight?:boolean}) {
  return <View style={[s.card,highlight && s.highlight]}>{children}</View>;
}
function Button({title,onPress,secondary=false,disabled=false}: {title:string;onPress:()=>void;secondary?:boolean;disabled?:boolean}) {
  return <Pressable accessibilityRole="button" disabled={disabled} onPress={onPress}
    style={[s.button,secondary && s.buttonSecondary,disabled && {opacity:.5}]}>
    <Text style={[s.buttonText,secondary && {color:K.text}]}>{title}</Text>
  </Pressable>;
}
function Field({label,value,onChange,placeholder,keyboardType}: {label:string;value:string;onChange:(v:string)=>void;placeholder?:string;keyboardType?:'default'|'decimal-pad'}) {
  return <View style={{marginBottom:13}}><Label>{label.toUpperCase()}</Label><TextInput value={value} onChangeText={onChange}
    placeholder={placeholder} placeholderTextColor={K.subtle} keyboardType={keyboardType||'default'}
    style={s.input} autoCapitalize={label==='Handicap'?'none':'sentences'}/></View>;
}
function Chip({label,selected,onPress}: {label:string;selected:boolean;onPress:()=>void}) {
  return <Pressable accessibilityRole="button" accessibilityState={{selected}} onPress={onPress}
    style={[s.chip,selected && s.chipActive]}><Text style={[s.chipText,selected && {color:K.ink}]}>{label}</Text></Pressable>;
}
function Row({left,right}: {left:string;right:string}) {return <View style={s.row}><Text style={{color:K.muted}}>{left}</Text><Text style={s.rowStrong}>{right}</Text></View>;}
function Section({children}: {children:string}) {return <Text style={s.section}>{children}</Text>;}
function Stat({label,value}: {label:string;value:string}) {return <View style={{flex:1}}><Label>{label}</Label><Text style={s.stat}>{value}</Text></View>;}
function Page({children}: {children:React.ReactNode}) {return <ScrollView style={{flex:1}} contentContainerStyle={{paddingHorizontal:20,paddingTop:24,paddingBottom:40,gap:14}} keyboardShouldPersistTaps="handled">{children}</ScrollView>;}
function HoleCount(round:Round){return round.holes.filter(h=>h.strokes!==null).length;}
function Summary(round:Round){
 const done=round.holes.filter(h=>h.strokes!==null);
 const score=done.reduce((n,h)=>n+(h.strokes||0),0);
 const par=done.reduce((n,h)=>n+h.par,0);
 const delta=score-par;
 return {done:done.length,score,relative:done.length ? (delta>0?'+':'')+String(delta) : '—',par};
}
function Choice({value,options,select}: {value:string;options:string[];select:(v:string)=>void}) {
 return <View style={s.options}>{options.map(v=><Chip key={v} label={v} selected={v===value} onPress={()=>select(v)}/>)}</View>;
}

export default function App() {
 const [data,setData] = useState<Data>(initial);
 const [loaded,setLoaded] = useState(false);
 const [loadError,setLoadError] = useState('');
 const [tab,setTab] = useState<Tab>('home');
 const [view,setView] = useState<'Face-on'|'Down-the-line'>('Face-on');
 const [selectedClub,setSelectedClub] = useState('');
 const [clubInput,setClubInput] = useState('');
 const [courseInput,setCourseInput] = useState('');
 const [practice,setPractice] = useState('');
 const [practiceReps,setPracticeReps] = useState('10');
 const [statsPeriod,setStatsPeriod] = useState<'7 DAYS'|'30 DAYS'|'ALL TIME'>('30 DAYS');
 const [coachPrompt,setCoachPrompt] = useState('');
 const [editingProfile,setEditingProfile] = useState(false);
 const [working,setWorking] = useState(false);
 const [formName,setFormName] = useState('');
 const [formHand,setFormHand] = useState<'right'|'left'>('right');
 const [formLevel,setFormLevel] = useState('Beginner');
 const [formUnits,setFormUnits] = useState<'yards'|'meters'>('yards');
 const [formHandicap,setFormHandicap] = useState('');
 useEffect(()=>{
   let active=true;
   AsyncStorage.getItem(KEY).then(raw=>{
     if(!active)return;
     if(raw){const parsed=JSON.parse(raw) as Data; if(!parsed || !Array.isArray(parsed.clubs) || !Array.isArray(parsed.rounds) || !Array.isArray(parsed.swings))throw Error('Saved profile format is invalid'); setData({...initial,...parsed,practiceSessions:Array.isArray(parsed.practiceSessions)?parsed.practiceSessions:[]});}
     setLoaded(true);
   }).catch(e=>{if(active){setLoadError(String(e));setLoaded(true);}});
   return ()=>{active=false;};
 },[]);
 useEffect(()=>{if(!loaded || loadError)return; AsyncStorage.setItem(KEY,JSON.stringify(data)).catch(e=>setLoadError('Save failed: '+String(e)));},[data,loaded,loadError]);
 const change=(update:(previous:Data)=>Data)=>setData(previous=>update(previous));
 const activeClubs=data.clubs.filter(c=>c.active);
 const roundsFinished=data.rounds.filter(r=>r.finished);
 const round=data.rounds.find(r=>!r.finished);
 const scoredHoles=roundsFinished.flatMap(r=>r.holes.filter(h=>h.strokes!==null));
 const parOrBetter=scoredHoles.length ? Math.round(100*scoredHoles.filter(h=>(h.strokes||0)<=h.par).length/scoredHoles.length)+'%' : '—';
 const inPeriod=(date:string)=>{
   if(statsPeriod==='ALL TIME')return true;
   const t=Date.parse(date);
   return Number.isFinite(t)&&t>=Date.now()-(statsPeriod==='7 DAYS'?7:30)*86400000;
 };
 const periodRounds=roundsFinished.filter(r=>inPeriod(r.date));
 const periodHoles=periodRounds.flatMap(r=>r.holes.filter(h=>h.strokes!==null));
 const periodPar=periodHoles.length?Math.round(100*periodHoles.filter(h=>(h.strokes||0)<=h.par).length/periodHoles.length)+'%':'—';
 const periodBirdies=periodHoles.filter(h=>(h.strokes||0)<h.par).length;
 const periodSwings=data.swings.filter(sw=>inPeriod(sw.date));
 const validHandicap = (value:string)=>value.trim()==='' || (Number.isFinite(Number(value)) && Number(value)>=-10 && Number(value)<=54);
 const beginEdit=()=>{
   if(!data.player)return;
   setFormName(data.player.name);setFormHand(data.player.hand);setFormLevel(data.player.experience);
   setFormUnits(data.player.units);setFormHandicap(data.player.handicap);setEditingProfile(true);
 };
 const saveEdit=()=>{
   if(!formName.trim())return Alert.alert('Enter a name');
   if(!validHandicap(formHandicap))return Alert.alert('Invalid handicap','Use a number from -10 to 54 or leave blank.');
   change(old=>({...old,player:{name:formName.trim(),hand:formHand,experience:formLevel,units:formUnits,handicap:formHandicap.trim()}}));
   setEditingProfile(false);
 };
 const completePractice=()=>{
   const reps=Number(practiceReps);
   if(!Number.isInteger(reps)||reps<1||reps>500)return Alert.alert('Invalid count','Enter 1 to 500 completed swings.');
   change(old=>({...old,practiceSessions:[{id:id(),drill:practice,date:new Date().toISOString(),reps},...old.practiceSessions]}));
   setPractice('');setPracticeReps('10');Alert.alert('Session saved',reps+' practice swings logged.');
 };
 const setup=()=>{
   if(!formName.trim())return Alert.alert('Name required','Enter your name to continue.');
   if(!validHandicap(formHandicap))return Alert.alert('Invalid handicap','Use a value between -10 and 54, or leave it blank.');
   change(old=>({...old,player:{name:formName.trim(),hand:formHand,experience:formLevel,units:formUnits,handicap:formHandicap.trim()}}));
 };
 const addClub=()=>{
   const name=clubInput.trim();
   if(!name)return;
   if(activeClubs.some(c=>c.name.toLowerCase()===name.toLowerCase()))return Alert.alert('Already in your bag',name+' is already listed.');
   change(old=>({...old,clubs:[...old.clubs,{id:id(),name,active:true}]}));
   setClubInput('');
 };
 const newRound=(holes:9|18)=>{
   const course=courseInput.trim()||'Practice round';
   const created:Round={id:id(),course,finished:false,date:new Date().toISOString(),
     holes:Array.from({length:holes},(_,i)=>({number:i+1,par:4,strokes:null}))};
   change(old=>({...old,rounds:[created,...old.rounds]}));setCourseInput('');
 };
 const editHole=(number:number,field:'par'|'strokes',delta:number)=>{
   change(old=>({...old,rounds:old.rounds.map(r=>!r.finished&&r.id===round?.id?{...r,holes:r.holes.map(h=>{
     if(h.number!==number)return h;
     if(field==='par')return {...h,par:Math.min(6,Math.max(3,h.par+delta))};
     return {...h,strokes:Math.min(30,Math.max(1,(h.strokes||0)+delta))};
   })}:r)}));
 };
 const pickVideo=async(fromCamera:boolean)=>{
   if(!selectedClub)return Alert.alert('Choose a club','Add or select a club before saving a swing.');
   try {
     setWorking(true);
     if(fromCamera){
       const perm=await ImagePicker.requestCameraPermissionsAsync();
       if(!perm.granted){Alert.alert('Permission needed','Camera permission is required to record a swing.');return;}
     }
     const result=fromCamera
       ? await ImagePicker.launchCameraAsync({mediaTypes:['videos'],quality:1,videoMaxDuration:30})
       : await ImagePicker.launchImageLibraryAsync({mediaTypes:['videos'],quality:1});
     if(result.canceled || !result.assets?.length)return;
     const asset=result.assets[0];
     const swingId=id();
     const dir=new Directory(Paths.document,'swings');
     dir.create({idempotent:true,intermediates:true});
     const original=new File(asset.uri);
     const extension=(asset.fileName||'swing.mp4').toLowerCase().endsWith('.mov')?'.mov':'.mp4';
     const target=new File(dir,swingId+extension);
     original.copy(target);
     change(old=>({...old,swings:[{id:swingId,date:new Date().toISOString(),clubId:selectedClub,view,videoUri:target.uri},...old.swings]}));
     Alert.alert('Swing saved','Your video was copied to local app storage. AI analysis has not been implemented yet.');
   } catch(e){Alert.alert('Unable to save video',String(e));}
   finally{setWorking(false);}
 };
 const deleteData=()=>Alert.alert('Delete your data?','This removes your profile, scorecards, and swing records from this device. It cannot be undone.',[
   {text:'Cancel',style:'cancel'},
   {text:'Delete',style:'destructive',onPress:async()=>{
     try {
       const dir=new Directory(Paths.document,'swings');
       if(dir.exists)dir.delete();
       await AsyncStorage.removeItem(KEY);
       setData(initial);setTab('home');
     }catch(e){Alert.alert('Could not delete all records',String(e));}
   }}
 ]);
 if(!loaded)return <SafeAreaView style={s.loading}><ActivityIndicator color={K.green}/><Text style={s.body}>Loading Fairways…</Text></SafeAreaView>;
 if(loadError)return <SafeAreaView style={[s.loading,{padding:24}]}><Text style={s.h2}>Local data needs attention</Text><Body>{loadError}</Body><Body>Existing data has not been overwritten. Reinstalling the application may delete it.</Body></SafeAreaView>;
 return <SafeAreaView style={s.root}><StatusBar barStyle="light-content"/>
 <View style={s.top}>
   <Image source={require('./assets/fairways-symbol.png')} style={s.brandSymbol} resizeMode="contain" />
   <Text style={s.brand}>Fairways</Text><View style={{flex:1}}/>
   {data.player ? <Pressable accessibilityRole="button" accessibilityLabel="Open profile" onPress={()=>setTab('profile')} style={s.avatar}>
      <Text style={{color:K.text,fontWeight:'800'}}>{data.player.name.trim().slice(0,2).toUpperCase()}</Text>
   </Pressable> : <Text style={s.beta}>POCKET COACH · BETA</Text>}
  </View>
 {!data.player ? <Page>
   <Title eyebrow="WELCOME TO FAIRWAYS" title="Build your better game." detail="Your personal golf companion. Start with a local player profile."/>
   <Card highlight><Text style={s.h2}>Your golfer profile</Text>
     <Field label="Display name" value={formName} onChange={setFormName} placeholder="Your name"/>
     <Label>HANDEDNESS</Label><Choice value={formHand} options={['right','left']} select={v=>setFormHand(v as 'right'|'left')}/>
     <Label>EXPERIENCE</Label><Choice value={formLevel} options={['Beginner','Intermediate','Advanced']} select={setFormLevel}/>
     <Label>DISTANCE UNITS</Label><Choice value={formUnits} options={['yards','meters']} select={v=>setFormUnits(v as 'yards'|'meters')}/>
     <Field label="Handicap (optional)" value={formHandicap} onChange={setFormHandicap} keyboardType="decimal-pad"/>
     <Button title="START MY JOURNEY  →" onPress={setup}/>
   </Card><Body>Offline-first preview · No cloud account or AI analysis yet.</Body>
 </Page> : <>

 {tab==='home'&&<Page>
   <ImageBackground
      accessibilityLabel="Golf course hero background"
      source={{uri:'https://images.unsplash.com/photo-1592919505780-303950717480?auto=format&fit=crop&w=1000&q=85'}}
      style={s.photoHero} imageStyle={s.photoImage}>
      <View style={s.photoOverlay}/>
      <View style={s.photoKicker}><Text style={s.accentLabel}>✦  YOUR DAILY PLAN</Text></View>
      <View style={s.photoContent}>
        <Text style={s.heroGreeting}>Good morning, {firstName(data.player.name)}</Text>
        <Text style={s.photoSubheading}>Ready to improve your swing?</Text>
        <View style={s.heroScore}><Label>SWING SCORE</Label><Text style={s.heroScoreValue}>—</Text></View>
      </View>
   </ImageBackground>
   <View style={[s.card,s.summaryBand]}>
     <Stat label="HANDICAP" value={data.player.handicap||'—'}/>
     <Stat label="ROUNDS" value={String(roundsFinished.length)}/>
     <Stat label="SWINGS" value={String(data.swings.length)}/>
   </View>
   <View style={s.coachCard}>
      <View style={s.coachGlow}/>
      <View style={{flexDirection:'row',alignItems:'center',justifyContent:'space-between'}}>
        <Text style={s.accentLabel}>✦  AI COACH</Text><Text style={{color:K.green}}>· · ·</Text>
      </View>
      <Text style={s.coachHeading}>Your AI Coach</Text>
      <Text style={s.coachSubtitle}>Let's work on your swing.</Text>
      <View style={s.focus}>
        <Text style={s.accentLabel}>TODAY'S FOCUS</Text>
        <Text style={[s.h2,{marginBottom:6}]}>Build the baseline</Text>
        <Body>Record consistent face-on or down-the-line swings. Personalized diagnosis becomes available after validated analysis is built.</Body>
      </View>
      <Button title="START SESSION   →" onPress={()=>setTab('swing')}/>
   </View>
   <View style={s.sectionPanel}>
      <Section>QUICK ACTIONS</Section>
      <View style={s.grid}>
        <Pressable style={[s.quick,s.highlight]} onPress={()=>setTab('swing')}>
          <Text style={s.quickIcon}>◎</Text><Text style={s.quickText}>Analyze{'\n'}Swing</Text>
        </Pressable>
        <Pressable style={s.quick} onPress={()=>setTab('practice')}>
          <Text style={s.quickIcon}>◉</Text><Text style={s.quickText}>Practice</Text>
        </Pressable>
        <Pressable style={s.quick} onPress={()=>Alert.alert('Coming soon','Shot diagnosis requires swing analysis, which is not yet implemented.')}>
          <Text style={s.quickIcon}>✧</Text><Text style={s.quickText}>Why Did I{'\n'}Hit That?</Text>
        </Pressable>
      </View>
   </View>
   <View style={s.sectionPanel}>
      <Text style={s.h2}>Recent Performance</Text>
      <View style={[s.card,{flexDirection:'row',alignItems:'center',gap:18}]}>
        <View style={s.scoreRing}><Text style={s.scoreRingValue}>{parOrBetter}</Text></View>
        <View style={{flex:1}}>
          <Label>PAR OR BETTER</Label><Body>Across completed rounds</Body>
          <Row left="Rounds" right={String(roundsFinished.length)}/>
          <Row left="Scored holes" right={String(scoredHoles.length)}/>
        </View>
      </View>
      <Body>Swing analysis scores will appear after measurements are validated.</Body>
   </View>
   <Card>
      <Text style={s.h2}>Your Progress</Text>
      <View style={s.metrics}>
        <Stat label="FINISHED ROUNDS" value={String(periodRounds.length)}/>
        <Stat label="SAVED SWINGS" value={String(data.swings.length)}/>
      </View>
      <Body>Build a history of swings and rounds to see measurable progress here.</Body>
   </Card>
   <Card>
      <Text style={s.h2}>{round?'Continue '+round.course:'Track your next round'}</Text>
      <Body>{round?String(HoleCount(round))+' / '+round.holes.length+' holes recorded':'Create a nine- or eighteen-hole scorecard.'}</Body>
      <Button title={round?'CONTINUE ROUND':'START ROUND'} onPress={()=>setTab('stats')} secondary/>
   </Card>
   {data.swings.length>0&&<Card>
      <Text style={s.h2}>Last Session</Text>
      <Row left="Recorded" right={formatDate(data.swings[0].date)}/>
      <Row left="View" right={data.swings[0].view}/>
      <Button title="VIEW SWING HISTORY  →" onPress={()=>setTab('swing')} secondary/>
   </Card>}
 </Page>}
  {tab==='swing'&&<Page>
   <Title eyebrow="AI SWING LAB" title="Record Your Swing" detail="Use a consistent camera angle for reliable future measurements."/>
   <View style={s.camera}><View style={{alignItems:'center',paddingBottom:8}}>
     <Text style={s.accentLabel}>●  READY TO CAPTURE</Text></View><View style={s.frame}><Text style={{color:K.green,fontSize:58}}>◎</Text>
       <Text style={{color:K.text,fontWeight:'700',marginTop:8}}>POSITION YOUR PHONE</Text>
       <Text style={{color:K.muted,fontSize:12,marginTop:5}}>Keep your whole body and club in frame.</Text></View>
       <View style={s.switchRow}><Chip label="FACE-ON" selected={view==='Face-on'} onPress={()=>setView('Face-on')}/>
       <Chip label="DOWN-THE-LINE" selected={view==='Down-the-line'} onPress={()=>setView('Down-the-line')}/></View></View>
   <Label>SELECT CLUB</Label><ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{gap:8}}>
     {activeClubs.map(c=><Chip key={c.id} label={c.name} selected={selectedClub===c.id} onPress={()=>setSelectedClub(c.id)}/>)}</ScrollView>
   {!activeClubs.length&&<Body>Add clubs under Profile → My Bag before recording.</Body>}
   <Button disabled={working||!activeClubs.length} title={working?'SAVING…':'RECORD A SWING  ◎'} onPress={()=>void pickVideo(true)}/>
   <Button disabled={working||!activeClubs.length} title="IMPORT FROM CAMERA ROLL" secondary onPress={()=>void pickVideo(false)}/>
   <Card><Text style={s.accentLabel}>✦  COMING NEXT</Text><Text style={s.h2}>Automatic swing analysis</Text>
      <Body>Pose landmarks, swing phases, posture and movement metrics, followed by coaching observations with confidence checks.</Body>
      <Body>No analysis has been performed on your videos yet.</Body></Card>
   <Card><Text style={s.accentLabel}>✦  ASK FAIRWAYS</Text><Text style={s.h2}>Ask your AI Coach</Text>
     <Body>Coaching responses are planned, not active yet.</Body>
     <TextInput style={[s.input,{height:85,textAlignVertical:'top'}]} multiline value={coachPrompt}
       onChangeText={setCoachPrompt} placeholder="What would you like to work on?" placeholderTextColor={K.subtle}/>
     <View style={s.options}>{['Hit a draw','More distance','Fix my slice'].map(t=>
       <Chip key={t} label={t} selected={coachPrompt===t} onPress={()=>setCoachPrompt(t)}/>)}</View>
     <Button title="ASK FAIRWAYS  →" secondary onPress={()=>Alert.alert('Coming soon','AI coaching is not connected yet.')}/></Card>
   <Section>SAVED SWINGS · {data.swings.length}</Section>{!data.swings.length?<Body>No recordings saved yet.</Body>:
     data.swings.slice(0,12).map(sw=><Card key={sw.id}><Row left={formatDate(sw.date)} right={sw.view}/>
       <Body>{data.clubs.find(c=>c.id===sw.clubId)?.name||'Unknown club'} · Video saved on this device</Body></Card>)}
 </Page>}
 {tab==='stats'&&<Page>
   <Title eyebrow="PERFORMANCE" title="Your Stats" detail="Real performance from your saved rounds and recordings."/>
   <View style={{flexDirection:'row',padding:5,borderRadius:12,backgroundColor:K.surface,gap:4}}>
   {(['7 DAYS','30 DAYS','ALL TIME'] as const).map(p=><Pressable key={p} onPress={()=>setStatsPeriod(p)}
     style={{flex:1,alignItems:'center',paddingVertical:10,borderRadius:9,backgroundColor:statsPeriod===p?K.card2:'transparent'}}>
     <Text style={{color:statsPeriod===p?K.green:K.muted,fontSize:11,fontWeight:'800'}}>{p}</Text></Pressable>)}</View>
   <Card highlight><Label>SWINGS CAPTURED · {statsPeriod}</Label><Text style={{color:K.green,fontSize:34,fontWeight:'800'}}>{periodSwings.length}</Text>
    <Body>Videos recorded in this period; swing quality metrics await verified analysis.</Body></Card>
   <View style={s.metrics}><Card><Stat label="FINISHED ROUNDS" value={String(roundsFinished.length)}/></Card>
      <Card><Stat label="PAR OR BETTER" value={periodPar}/></Card></View>
   <View style={{padding:15,backgroundColor:'#20392a',borderRadius:13}}>
    <Text style={s.accentLabel}>✦  PERIOD SUMMARY</Text><Body>{periodHoles.length} holes scored · {periodBirdies} birdies or better</Body></View>
   <Section>ROUND TRACKER</Section>
   {!round&&<Card><Text style={s.h2}>Start a round</Text>
      <Field label="Course" value={courseInput} onChange={setCourseInput} placeholder="Practice round"/>
      <View style={{flexDirection:'row',gap:8}}><View style={{flex:1}}><Button title="9 HOLES" onPress={()=>newRound(9)}/></View>
      <View style={{flex:1}}><Button title="18 HOLES" onPress={()=>newRound(18)} secondary/></View></View></Card>}
   {round&&<Card highlight><Text style={s.h2}>{round.course}</Text><Row left="HOLES RECORDED" right={String(HoleCount(round))+'/'+round.holes.length}/>
     <Row left="RELATIVE TO PAR" right={Summary(round).relative}/>
     <View style={s.row}><Label>HOLE · PAR</Label><Label>STROKES</Label></View>
     {round.holes.map(h=><View key={h.number} style={s.holeRow}>
       <View style={{flex:1}}><Text style={s.rowStrong}>#{h.number}</Text>
         <View style={{flexDirection:'row',alignItems:'center',gap:10}}><Pressable onPress={()=>editHole(h.number,'par',-1)}><Text style={s.counter}>−</Text></Pressable>
           <Text style={s.rowStrong}>Par {h.par}</Text><Pressable onPress={()=>editHole(h.number,'par',1)}><Text style={s.counter}>+</Text></Pressable></View></View>
       <View style={{flexDirection:'row',alignItems:'center',gap:13}}><Pressable onPress={()=>editHole(h.number,'strokes',-1)}><Text style={s.counter}>−</Text></Pressable>
         <Text style={s.h2}>{h.strokes??'—'}</Text><Pressable onPress={()=>editHole(h.number,'strokes',1)}><Text style={s.counter}>+</Text></Pressable></View></View>)}
     <Button title="FINISH ROUND" onPress={()=>{
       if(!HoleCount(round))return Alert.alert('Add a score first','Record at least one hole.');
       Alert.alert('Finish round?','Scores will be locked. Unplayed holes will not count toward your statistics.',[
         {text:'Keep playing',style:'cancel'}, {text:'Finish',onPress:()=>change(old=>({...old,rounds:old.rounds.map(r=>r.id===round.id?{...r,finished:true}:r)}))}
       ]);
     }}/></Card>}
   <Section>ROUND HISTORY</Section>{!data.rounds.length?<Body>No round history yet.</Body>:
     data.rounds.map(r=><Card key={r.id}><Row left={r.course} right={Summary(r).relative}/>
       <Body>{formatDate(r.date)} · {r.finished?'Finished':'In progress'} · {Summary(r).done} holes played</Body></Card>)}
 </Page>}
 {tab==='practice'&&<Page>
   <Title eyebrow="TRAINING" title="Practice" detail="Build good habits, one focused session at a time."/>
   <Card><View style={{flexDirection:'row',justifyContent:'space-between'}}><Label>COMPLETED SESSIONS</Label>
   <Text style={s.accentLabel}>{data.practiceSessions.length}</Text></View><Label>TOTAL PRACTICE SWINGS</Label>
   <Text style={{color:K.green,fontSize:30,fontWeight:'700'}}>{data.practiceSessions.reduce((n,p)=>n+p.reps,0)}</Text></Card>
   <Card highlight><Text style={s.accentLabel}>✦  START HERE</Text><Text style={[s.h2,{fontSize:26}]}>Clubface Awareness</Text>
      <Body>Start with smooth half swings, pause at waist height, and check the face orientation. This is a general drill, not an AI diagnosis.</Body>
      <Button title="VIEW DRILL" onPress={()=>setPractice('Clubface Awareness')}/></Card>
   <Section>TRAINING LIBRARY</Section>
   {[['Tempo & Balance','Make slow practice swings with an even count and balanced finish.'],
      ['Contact Fundamentals','Use short swings and check your setup consistently before each strike.'],
      ['Alignment Check','Place a club or alignment stick on the ground pointing at your target.']].map(([name,detail])=>
      <Pressable key={name} onPress={()=>setPractice(name)} style={s.drill}><Text style={s.accentLabel}>◎</Text>
        <View style={{flex:1}}><Text style={s.rowStrong}>{name}</Text><Text style={{color:K.muted,fontSize:12,marginTop:4}}>{detail}</Text></View><Text style={{color:K.green}}>›</Text></Pressable>)}
   {practice&&<Card><Text style={s.accentLabel}>SELECTED DRILL</Text><Text style={s.h2}>{practice}</Text>
     <Body>Record three to five controlled swings and compare your setup and motion across repetitions. Automated feedback is not yet enabled.</Body>
     <Button title="OPEN SWING STUDIO" secondary onPress={()=>setTab('swing')}/>
     <Field label="Swings completed" value={practiceReps} onChange={setPracticeReps} keyboardType="decimal-pad"/>
     <Button title="LOG PRACTICE SESSION  ✓" onPress={completePractice}/></Card>}
   <Section>PRACTICE HISTORY</Section>
   {!data.practiceSessions.length?<Body>No practice sessions recorded yet.</Body>:
     data.practiceSessions.slice(0,12).map(p=><Card key={p.id}>
       <Text style={s.rowStrong}>{p.drill}</Text><Row left={formatDate(p.date)} right={p.reps+' swings'}/></Card>)}
 </Page>}
 {tab==='profile'&&<Page>
   <Title eyebrow="ACCOUNT" title="Profile"/>
   <Pressable onPress={beginEdit} style={{alignSelf:'flex-end',borderWidth:1,borderColor:K.line,borderRadius:10,padding:10}}>
     <Text style={{color:K.green,fontWeight:'800'}}>EDIT MY PROFILE</Text></Pressable>
   {editingProfile&&<Card highlight><Text style={s.h2}>Edit your golfer profile</Text>
     <Field label="Name" value={formName} onChange={setFormName}/>
     <Label>HANDEDNESS</Label><Choice value={formHand} options={['right','left']} select={v=>setFormHand(v as 'right'|'left')}/>
     <Label>EXPERIENCE</Label><Choice value={formLevel} options={['Beginner','Intermediate','Advanced']} select={setFormLevel}/>
     <Label>UNITS</Label><Choice value={formUnits} options={['yards','meters']} select={v=>setFormUnits(v as 'yards'|'meters')}/>
     <Field label="Handicap" value={formHandicap} onChange={setFormHandicap} keyboardType="decimal-pad"/>
     <Button title="SAVE PROFILE" onPress={saveEdit}/>
     <Button title="CANCEL" secondary onPress={()=>setEditingProfile(false)}/></Card>
   <Card highlight><View style={{flexDirection:'row',alignItems:'center',gap:14}}><View style={s.avatar}>
     <Text style={s.rowStrong}>{data.player.name.slice(0,2).toUpperCase()}</Text></View>
     <View style={{flex:1}}><Text style={s.h2}>{data.player.name}</Text>
     <Body>{data.player.experience} · {data.player.hand==='right'?'Right-handed':'Left-handed'}</Body></View></View>
     <Row left="HANDICAP" right={data.player.handicap||'Not set'}/><Row left="DISTANCE UNITS" right={data.player.units}/></Card>
   <Section>MY BAG</Section><Card><View style={s.row}><Text style={s.h2}>Your Clubs</Text><Label>{activeClubs.length} ACTIVE</Label></View>
     <Field label="Add a club" value={clubInput} onChange={setClubInput} placeholder="e.g. 7 Iron"/>
     <Button title="ADD TO BAG" onPress={addClub}/>
     {activeClubs.map(c=><View key={c.id} style={s.row}><Text style={s.rowStrong}>{c.name}</Text>
       <Pressable onPress={()=>change(old=>({...old,clubs:old.clubs.map(x=>x.id===c.id?{...x,active:false}:x)}))}>
         <Text style={{color:K.danger,fontWeight:'700'}}>REMOVE</Text></Pressable></View>)}
     {!activeClubs.length&&<Body>Your bag is empty. Add your first club.</Body>}</Card>
   <Section>PRIVACY AND SETTINGS</Section><Card><Text style={s.h2}>Your data stays on your phone</Text>
     <Body>This prototype saves your profile, club IDs, scorecards, and swing videos locally. It does not upload them or provide cloud backup.</Body>
     <Body>Secure sign-in, multi-device sync, and AI coaching are future milestones.</Body>
     <Button title="DELETE LOCAL DATA" secondary onPress={deleteData}/></Card>
 </Page>}
 <View style={s.nav}>{([
   ['home','⌂','HOME'],['swing','◎','SWING'],['stats','▥','STATS'],['practice','◉','PRACTICE'],['profile','♙','PROFILE']
 ] as [Tab,string,string][]).map(([key,icon,label])=><Pressable accessibilityRole="tab"
   accessibilityState={{selected:tab===key}} key={key} onPress={()=>setTab(key)} style={s.navButton}>
   <Text style={{fontSize:21,color:tab===key?K.green:K.subtle}}>{icon}</Text>
   <Text style={{fontSize:9,fontWeight:'800',color:tab===key?K.green:K.subtle}}>{label}</Text></Pressable>)}</View>
 </>}
 </SafeAreaView>;
}
const s=StyleSheet.create({
 root:{flex:1,backgroundColor:K.bg},loading:{flex:1,backgroundColor:K.bg,justifyContent:'center',alignItems:'center',gap:20},
 top:{height:80,paddingHorizontal:20,flexDirection:'row',alignItems:'center',gap:7},
 brandSymbol:{height:34,width:34},
 brand:{color:'#cbbf86',fontSize:18,fontWeight:'900',letterSpacing:-.6},beta:{color:K.subtle,fontSize:9,fontWeight:'800',letterSpacing:1},
 pageTitle:{fontSize:29,fontWeight:'700',color:K.text,letterSpacing:-.8,marginTop:7,marginBottom:8},
 label:{fontSize:10,color:K.subtle,letterSpacing:1.4,fontWeight:'800',marginBottom:6},
 body:{fontSize:13,color:K.muted,lineHeight:20,marginBottom:5},h2:{fontSize:18,color:K.text,fontWeight:'700',marginBottom:9},
 card:{backgroundColor:K.card,borderColor:K.line,borderWidth:1,borderRadius:19,padding:19,gap:9},
 summaryBand:{flexDirection:'row',gap:12,marginTop:0,paddingVertical:16},
 photoHero:{height:292,borderRadius:23,backgroundColor:K.card2,overflow:'hidden',justifyContent:'space-between'},
 photoImage:{borderRadius:23},
 photoOverlay:{position:'absolute',top:0,left:0,right:0,bottom:0,backgroundColor:'rgba(7,13,10,0.58)'},
 photoKicker:{alignSelf:'flex-start',paddingHorizontal:13,paddingVertical:9,marginTop:18,marginLeft:16,backgroundColor:'rgba(7,13,10,.75)',borderRadius:11,borderWidth:1,borderColor:'#437850'},
 photoContent:{padding:22,paddingBottom:25},
 heroGreeting:{color:K.text,fontSize:27,fontWeight:'800',letterSpacing:-.8,maxWidth:270},
 photoSubheading:{color:'#cbd7cd',fontSize:13,marginTop:6},
 heroScore:{position:'absolute',right:22,bottom:22,alignItems:'flex-end',paddingLeft:12,borderLeftWidth:1,borderLeftColor:'#579b62'},
 heroScoreValue:{color:K.green,fontSize:26,fontWeight:'800'},
 coachCard:{minHeight:302,padding:22,borderRadius:22,overflow:'hidden',backgroundColor:K.card2,borderWidth:1,borderColor:'#396a49',marginBottom:0,justifyContent:'space-between'},
 coachGlow:{position:'absolute',top:50,left:0,height:115,width:3,backgroundColor:K.green},
 coachHeading:{fontSize:25,fontWeight:'700',letterSpacing:-.7,color:K.text,marginTop:10},
 coachSubtitle:{fontSize:14,color:K.muted,marginTop:-3},
 sectionPanel:{padding:18,backgroundColor:'#171d1a',borderWidth:1,borderColor:K.line,borderRadius:19,gap:13},
 scoreRing:{height:98,width:98,borderRadius:49,borderWidth:6,borderColor:'#437850',alignItems:'center',justifyContent:'center'},
 scoreRingValue:{color:K.green,fontSize:24,fontWeight:'800'},
 highlight:{backgroundColor:K.card2,borderColor:'#376348'},
 button:{minHeight:48,backgroundColor:K.green,borderRadius:12,justifyContent:'center',alignItems:'center',paddingHorizontal:14,marginTop:6},
 buttonSecondary:{backgroundColor:K.surface,borderColor:K.line,borderWidth:1},
 buttonText:{fontSize:11,fontWeight:'900',letterSpacing:1,color:K.ink,textAlign:'center'},
 input:{height:43,borderWidth:1,borderColor:K.line,borderRadius:10,backgroundColor:K.bg,color:K.text,paddingHorizontal:12,fontSize:14},
 chip:{borderWidth:1,borderColor:K.line,backgroundColor:K.surface,paddingHorizontal:12,paddingVertical:9,borderRadius:12},
 chipActive:{backgroundColor:K.green,borderColor:K.green},
 chipText:{color:K.muted,fontSize:11,fontWeight:'700'},
 options:{flexDirection:'row',flexWrap:'wrap',gap:7,marginBottom:12},
 row:{flexDirection:'row',alignItems:'center',justifyContent:'space-between',paddingVertical:10,borderBottomWidth:1,borderBottomColor:K.line,gap:12},
 rowStrong:{color:K.text,fontSize:13,fontWeight:'700'},
 section:{color:K.subtle,fontSize:10,fontWeight:'800',letterSpacing:1.6,marginTop:9},
 stat:{color:K.text,fontSize:21,fontWeight:'700',marginTop:2},
 heroHeading:{flexDirection:'row',alignItems:'center',gap:12},
 avatar:{height:48,width:48,borderRadius:25,borderColor:'#385943',borderWidth:1,backgroundColor:'#29332d',alignItems:'center',justifyContent:'center'},
 metrics:{flexDirection:'row',gap:10,paddingVertical:15},
 accentLabel:{color:K.green,fontWeight:'800',fontSize:10,letterSpacing:1.3,marginBottom:8},
 focus:{borderLeftWidth:2,borderLeftColor:'#44744c',paddingLeft:14,marginVertical:18,gap:5},
 grid:{flexDirection:'row',gap:10},quick:{flex:1,minHeight:110,padding:12,borderRadius:15,borderColor:K.line,borderWidth:1,backgroundColor:K.surface,justifyContent:'space-between'},
 quickIcon:{fontSize:23,color:K.green},quickText:{color:K.text,fontSize:12,fontWeight:'700'},
 camera:{height:320,borderRadius:20,borderWidth:1,borderColor:'#365741',backgroundColor:'#171f1a',padding:16,justifyContent:'space-between'},
 frame:{flex:1,borderWidth:1,borderColor:'#365741',borderStyle:'dashed',marginBottom:14,borderRadius:13,alignItems:'center',justifyContent:'center'},
 switchRow:{flexDirection:'row',justifyContent:'center',gap:8},
 holeRow:{flexDirection:'row',alignItems:'center',paddingVertical:8,borderBottomWidth:1,borderBottomColor:K.line},
 counter:{fontSize:22,fontWeight:'800',color:K.green,paddingHorizontal:5},
 drill:{flexDirection:'row',alignItems:'center',gap:14,padding:17,backgroundColor:K.card,borderWidth:1,borderColor:K.line,borderRadius:16},
 nav:{flexDirection:'row',backgroundColor:'#101416',borderTopWidth:1,borderTopColor:K.line,paddingTop:9,paddingBottom:10},
 navButton:{flex:1,alignItems:'center',justifyContent:'center',gap:4,paddingVertical:3}
});
