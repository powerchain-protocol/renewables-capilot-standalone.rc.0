"use client";
import React from "react";
export class ErrorBoundary extends React.Component<React.PropsWithChildren,{error:Error|null}>{
  state:{error:Error|null}={error:null};
  static getDerivedStateFromError(error:Error){return{error};}
  render(){
    if(this.state.error)return <div className="rounded-xl border border-red-500/30 bg-red-500/5 p-4"><div className="font-semibold">Workspace error</div><p className="mt-1 text-sm text-[var(--muted-foreground)]">{this.state.error.message}</p><button className="mt-3 rounded-lg border px-3 py-2 text-sm" onClick={()=>this.setState({error:null})}>Retry</button></div>;
    return this.props.children;
  }
}
