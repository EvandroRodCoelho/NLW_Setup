interface ProgressProps {
  progress:number
}

export function ProgressBar(props:ProgressProps) {


  return(
  <div className='h-3 rounded-xl bg-zinc-700 w-full mt-4'>
    <div className='h-3 rounded-xl bg-violet-600 transition-all'
      role='progressbar'
      aria-valuenow={props.progress}
       aria-label='profress of habits in the day'
      style={{
        width:`${props.progress}%`
      }}>
    </div>
    </div>
)
}
