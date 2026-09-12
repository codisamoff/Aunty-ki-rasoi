---

## QA Notes (final audit)

- Every dish photo was verified with reverse image search. 20 images from the
  original `dish.zip` were **removed** because they showed the wrong subject
  (book scans, a plant, clothing, unrelated dishes) — those dishes intentionally
  render the gold-ornament fallback. To fill the gaps, re-run
  `python3 make_dish_zip.py` and re-check the results visually before shipping.
- Missing-photo dishes (fallback active): handi-paneer, mix-veg, chole-paneer,
  dry-masala, missi-roti, missi-pyaaz-roti, masala-roti, laccha-paratha,
  plain-naan, tikona-paratha, plain-rice, jeera-rice, paneer-matar-pulao,
  dal-chawal-fry, tari-rice, shahi-paneer-gravy-rice, boondi-raita,
  aloo-raita, mix-raita, plain-dahi.
- **TODO before publishing:** replace `tel:YOUR_PHONE_NUMBER_HERE` in
  `index.html` with the real phone number.
- Sticky-header overlap fixed via `--header-h`; scrollspy, reveal animations,
  and Hindi web-font (Noto Sans Devanagari) added; all motion is
  `prefers-reduced-motion` safe.
