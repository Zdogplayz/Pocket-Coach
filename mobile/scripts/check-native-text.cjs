// Lightweight native JSX render smoke test: detect raw text children under native containers.
const fs=require('node:fs'),vm=require('node:vm'),ts=require('typescript');
const source=fs.readFileSync(require('node:path').join(__dirname,'..','App.tsx'),'utf8');
const code=ts.transpileModule(source,{compilerOptions:{module:ts.ModuleKind.CommonJS,jsx:ts.JsxEmit.ReactJSX,target:ts.ScriptTarget.ES2020}}).outputText;
const elem=(type,props)=>({type,props:props||{}});
const names=['ActivityIndicator','Pressable','SafeAreaView','ScrollView','StatusBar','Text','TextInput','View','Image','ImageBackground'];
const RN={...Object.fromEntries(names.map(n=>[n,n])),Alert:{alert:()=>{}},StyleSheet:{create:v=>v}};
const React={useEffect:()=>{},useState:null,createElement:(type,props,...children)=>elem(type,{...props,children:children.length===1?children[0]:children})};
let hookIndex=0,values={};
React.useState=(defaultValue)=>{const i=hookIndex++;return [i in values?values[i]:defaultValue,()=>{}]};
const moduleObject={exports:{}};
function mockedRequire(n){
 if(n==='react')return {default:React,...React};
 if(n==='react/jsx-runtime')return {jsx:elem,jsxs:elem,Fragment:'Fragment'};
 if(n==='react-native')return RN;
 if(n==='@react-native-async-storage/async-storage')return {default:{getItem:async()=>null,setItem:async()=>{}}};
 if(n==='expo-image-picker')return {};
 if(n==='expo-file-system')return {Directory:function(){},File:function(){},Paths:{document:''}};
 if(n.startsWith('./assets/'))return 1;
 throw Error('Unexpected module: '+n);
}
vm.runInNewContext(code,{require:mockedRequire,module:moduleObject,exports:moduleObject.exports,console,Date,Math,Array,Number,String,JSON},{filename:'App.tsx'});
const containerTypes=new Set(['View','Pressable','SafeAreaView','ScrollView','ImageBackground']);
function walk(node,parent,path){
 if(node==null||typeof node==='boolean')return;
 if(Array.isArray(node)){node.forEach((item,i)=>walk(item,parent,path+'['+i+']'));return}
 if(typeof node==='string'||typeof node==='number'){
   if(containerTypes.has(parent))throw Error('Raw '+JSON.stringify(node)+' in <'+parent+'> at '+path);
   return;
 }
 if(typeof node!=='object')throw Error('Unsupported child '+String(node)+' at '+path);
 if(typeof node.type==='function')return walk(node.type(node.props),parent,path+'/'+(node.type.name||'Component'));
 if(node.type==='Fragment')return walk(node.props.children,parent,path+'/Fragment');
 return walk(node.props.children,node.type,path+'/'+String(node.type));
}
const player={name:'Demo Golfer',hand:'right',experience:'Beginner',units:'yards',handicap:''};
const empty={player,clubs:[],rounds:[],swings:[],practiceSessions:[]};
const full={...empty,clubs:[{id:'7i',name:'7 Iron',active:true}],
 swings:[{id:'s1',clubId:'7i',view:'Face-on',videoUri:'file:///s.mp4',date:new Date().toISOString()}],
 practiceSessions:[{id:'p1',drill:'Tempo',reps:10,date:new Date().toISOString()}]};
for(const tab of ['home','swing','stats','practice','profile']){
 for(const [label,data] of [['empty',empty],['populated',full]]){
   hookIndex=0;values={0:data,1:true,3:tab};
   walk(elem(moduleObject.exports.default,{}),null,'App/'+tab+'/'+label);
   console.log('PASS',tab,label);
 }
}
