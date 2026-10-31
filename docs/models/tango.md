# declare-lab/tango (Tango 2)

Text-to-audio for SFX and ambient sounds.  
https://replicate.com/declare-lab/tango

## Cost

- ~**$0.054** per run (varies; ~18 runs / $1 listed)
- Nvidia L40S; often ~1 minute depending on steps

## API inputs

| Field | Notes |
|-------|--------|
| `prompt` | Sound description |
| `model` | Use **`tango2`** for games (also: `tango`, `tango-full`, etc.) |
| `steps` | 100 default in examples; 200 higher quality/cost |
| `guidance` | Typically `3` |

## Example

```json
{
  "prompt": "Short coin collect chime with light sparkle",
  "model": "tango2",
  "steps": 100,
  "guidance": 3
}
```

Output: single WAV URI.

## In-game

Save under `public/assets/audio/`, load with `AudioSystem`, call `unlock()` on first user gesture.
