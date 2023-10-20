# portfolio 

A simple local DA valuation tool for thinking about the value of your ideas.

Features
-  Manage your 'ideas' (create/delete)
-  Add multiple scenarios of assessments to each idea
  - can represent opinions from different people or teams, different formulas for opportunity size, etc. 
  - scenarios properly model `opportunity size`, `risk`, and `cost`. The last two are represented in a `roadmap` with `phases`.
  - Good for lightweight intuition building and heavier analysis & encoding sessions.
  - Document reasons for choosing input values, leads to better convos later. 

Todo
- [ ] Save/Load multiple files to client desktop (instead of only the 1 `data.json` file in the web folder.)
- [ ] Assessment Object 
  - [ ] Allow changing name of input (requires lots of plumbing since the input names are used in many places)
- [ ] Compare how the portfolio looks from different people's PoV (innovation screen faceted by assessor)
- [ ] Compare how a single idea looks from different people's PoV (reuse innovation screen to show scenarios faceted by model where each assessment is shown independently.)
- Choose a scenario within an idea as the representation of that idea in the innovation screen
- See an "Innovation Screen" and "CFO Chart" on the front page of the portfolio
  - Show uncertainty in a half-violin plot (with dividers/marks for the important quantiles)
    - can ignore values below 10% and above 90%. Those long tails just add noise to the plot. 
    - shouldn't need to plot individual points, can just sample the quantile function at 20-50 points for the overall shape.
      - most ideas have a strong central tendency which is 'relatively' close to 0 with long tails on both ends. 
    - use the shape/color of the mark to show the loss %, upside/downside potential and so on. 
    - tooltips to zoom into or out of ideas
    - toggle showing uncertainty around an idea somehow (right click to highlight a couple and compare? )

Limitations
- Can't do more than one portfolio. If you need to do this, save separate files for each. 
- It's not an app, so no co-editing/sharing yet.
- Numerical quantities are either fixed values or modeled via metalog distributions. 
  - You can technically use any inverse quantile function in the model and it will work mathematically, but it is not supported right now. The main reason for this is that some inverse quantile functions have infinite tails and so lead to weird, overblown means. Controlling the tails is useful in many cases. 

To run:

```bash
$ cd web
$ python3 server.py 
# then load localhost:8080 in the browser.
# the server can be left intact. 
```

To develop: 

```bash
$ bash build.bash 
# in another tab run the server as shown above.
# then feel free to make edits to the client folder where the app is written.
# no HMR, so you'll need to reload to see changes. 
# The fixtures are really helpful to test UI components to avoid many gnarly bugs. 
```


