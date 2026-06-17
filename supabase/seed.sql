-- ============================================================
-- Nomichi Trip Desk · Seed Data
-- NOTE: Run schema.sql first.
-- Users must be created in Supabase Auth first, then their IDs
-- inserted here. Replace the UUIDs below with real auth user IDs
-- after creating users via Supabase Dashboard or Auth API.
-- ============================================================

-- IMPORTANT: Replace these UUIDs with actual auth.users IDs
-- You can create users via: Supabase Dashboard > Auth > Users
-- or use the seeding script in scripts/seed-users.ts

-- Seed Users (profiles only — auth records must exist first)
insert into public.users (id, email, full_name, role) values
  ('bca4acd8-68f2-45d4-8665-8500a145f67f', 'pranaykumarakuthota@gmail.com',   'Pranay Kumar',    'admin'),
  ('d9d9775c-eeae-44d1-85cb-048763d492cc', 'priya@gmail.com',   'Priya Shetty',   'associate'),
  ('a9661e58-409e-4964-a318-773719c8671e', 'suraj23@gmail.com',   'Suraj Prasad', 'associate')
on conflict (id) do nothing;


-- Seed Trips
insert into public.trips (id, name, destination, start_date, end_date, price_including_gst, total_seats, status, description) values
  (
    'aaaaaaaa-0000-0000-0000-000000000001',
    'Spiti in Winter',
    'Spiti Valley, Himachal Pradesh',
    '2025-01-18',
    '2025-01-27',
    38500.00,
    8,
    'open',
    'Ten days in a frozen valley where monasteries sit at 4200m and the silence is total. We stay in homestays, walk to villages most people skip, and eat what the family cooks.'
  ),
  (
    'aaaaaaaa-0000-0000-0000-000000000002',
    'Coorg Slow Week',
    'Coorg, Karnataka',
    '2025-02-08',
    '2025-02-14',
    24000.00,
    10,
    'open',
    'Six days on a working coffee estate at the edge of the forest. Morning walks, a coffee picking session, one waterfall, and a lot of time to read or talk.'
  ),
  (
    'aaaaaaaa-0000-0000-0000-000000000003',
    'Kutch Salt Season',
    'Rann of Kutch, Gujarat',
    '2025-03-01',
    '2025-03-07',
    29500.00,
    10,
    'open',
    'The white desert before the heat sets in. We meet the artisans, walk the salt flats at dusk, and spend a night at a local bhungas camp well away from the tourist circuit.'
  ),
  (
    'aaaaaaaa-0000-0000-0000-000000000004',
    'Dzukou Valley Trek',
    'Nagaland',
    '2024-10-15',
    '2024-10-22',
    32000.00,
    8,
    'closed',
    'A ridge-line valley that most people have never heard of. Rhododendrons in bloom, clean streams, and camps above the clouds. This batch is now full and closed.'
  )
on conflict (id) do nothing;

-- Seed Leads (15 leads across 3 open trips)
insert into public.leads (id, trip_id, owner_id, name, email, phone, group_type, preferred_month, trip_feeling, status, created_at) values
  -- Spiti in Winter leads
  (
    'bbbbbbbb-0000-0000-0000-000000000001',
    'aaaaaaaa-0000-0000-0000-000000000001',
    '00000000-0000-0000-0000-000000000002',
    'Rohan Desai',
    'rohan.desai@gmail.com',
    '+919876543210',
    'solo',
    'January',
    'I want to feel small and quiet. I spend too much time in meetings. I need somewhere that resets me.',
    'CONFIRMED',
    now() - interval '15 days'
  ),
  (
    'bbbbbbbb-0000-0000-0000-000000000002',
    'aaaaaaaa-0000-0000-0000-000000000001',
    '00000000-0000-0000-0000-000000000002',
    'Ananya Iyer',
    'ananya.iyer@outlook.com',
    '+919845123456',
    'friends',
    'January',
    'Three of us want something that feels real. Not a resort holiday. Something with a bit of edge.',
    'QUALIFIED',
    now() - interval '12 days'
  ),
  (
    'bbbbbbbb-0000-0000-0000-000000000003',
    'aaaaaaaa-0000-0000-0000-000000000001',
    '00000000-0000-0000-0000-000000000003',
    'Siddharth Nair',
    'sid.nair@proton.me',
    '+917788991122',
    'couple',
    'January',
    'We have been saying we will do a Himalayan trip for three years. We want it to feel earned, not packaged.',
    'VIBE_CHECK_SENT',
    now() - interval '10 days'
  ),
  (
    'bbbbbbbb-0000-0000-0000-000000000004',
    'aaaaaaaa-0000-0000-0000-000000000001',
    null,
    'Meera Pillai',
    'meera.pillai@gmail.com',
    '+918866554433',
    'solo',
    'January',
    'I saw your Spiti photos and I cannot stop thinking about them. I want to understand what it is actually like.',
    'NEW',
    now() - interval '2 days'
  ),
  (
    'bbbbbbbb-0000-0000-0000-000000000005',
    'aaaaaaaa-0000-0000-0000-000000000001',
    '00000000-0000-0000-0000-000000000002',
    'Kabir Mehta',
    'kabir.mehta@hotmail.com',
    '+919911223344',
    'friends',
    'February',
    'Four of us, all photographers. We want access to places a tour guide would not take us.',
    'NOT_A_FIT',
    now() - interval '20 days'
  ),
  -- Coorg Slow Week leads
  (
    'bbbbbbbb-0000-0000-0000-000000000006',
    'aaaaaaaa-0000-0000-0000-000000000002',
    '00000000-0000-0000-0000-000000000003',
    'Pooja Krishnamurthy',
    'pooja.krish@gmail.com',
    '+919900112233',
    'couple',
    'February',
    'We want something soft and green. No activities schedule. Just good food and slow mornings.',
    'CONTACTED',
    now() - interval '8 days'
  ),
  (
    'bbbbbbbb-0000-0000-0000-000000000007',
    'aaaaaaaa-0000-0000-0000-000000000002',
    '00000000-0000-0000-0000-000000000003',
    'Dhruv Bhat',
    'dhruv.bhat@gmail.com',
    '+919822334455',
    'family',
    'February',
    'My parents are retiring. I want to take them somewhere beautiful and simple. No rough roads.',
    'QUALIFIED',
    now() - interval '7 days'
  ),
  (
    'bbbbbbbb-0000-0000-0000-000000000008',
    'aaaaaaaa-0000-0000-0000-000000000002',
    null,
    'Tara Singh',
    'tara.s@icloud.com',
    '+917711223300',
    'solo',
    'March',
    'I work in tech and I need six days where I am not checking Slack. Something that makes me remember why I travel.',
    'NEW',
    now() - interval '1 day'
  ),
  (
    'bbbbbbbb-0000-0000-0000-000000000009',
    'aaaaaaaa-0000-0000-0000-000000000002',
    '00000000-0000-0000-0000-000000000002',
    'Rahul Ghosh',
    'rahul.ghosh@yahoo.com',
    '+918899001122',
    'friends',
    'February',
    'Two of us from Bangalore. We want coffee, forest walks, and good conversation with people we have not met yet.',
    'CONFIRMED',
    now() - interval '18 days'
  ),
  (
    'bbbbbbbb-0000-0000-0000-000000000010',
    'aaaaaaaa-0000-0000-0000-000000000002',
    '00000000-0000-0000-0000-000000000003',
    'Nisha Verma',
    'nisha.v@gmail.com',
    '+919776655443',
    'solo',
    'March',
    'I want to feel held. I have been through a hard year. I need somewhere that feels like it understands.',
    'CONTACTED',
    now() - interval '5 days'
  ),
  -- Kutch Salt Season leads
  (
    'bbbbbbbb-0000-0000-0000-000000000011',
    'aaaaaaaa-0000-0000-0000-000000000003',
    '00000000-0000-0000-0000-000000000002',
    'Aryan Kapoor',
    'aryan.kapoor@gmail.com',
    '+919955667788',
    'friends',
    'March',
    'Three friends, all designers. We love craft and texture. This one feels like it has both.',
    'VIBE_CHECK_SENT',
    now() - interval '9 days'
  ),
  (
    'bbbbbbbb-0000-0000-0000-000000000012',
    'aaaaaaaa-0000-0000-0000-000000000003',
    null,
    'Lakshmi Rao',
    'lakshmi.rao@gmail.com',
    '+918844002211',
    'couple',
    'March',
    'My partner and I collect stories. We want the kind of trip we will still be talking about in ten years.',
    'NEW',
    now() - interval '3 days'
  ),
  (
    'bbbbbbbb-0000-0000-0000-000000000013',
    'aaaaaaaa-0000-0000-0000-000000000003',
    '00000000-0000-0000-0000-000000000003',
    'Vivek Joshi',
    'vivek.j@proton.me',
    '+917799882211',
    'solo',
    'March',
    'I have never been to the Rann. I want to be in the white desert at dawn. That is the whole reason.',
    'QUALIFIED',
    now() - interval '11 days'
  ),
  (
    'bbbbbbbb-0000-0000-0000-000000000014',
    'aaaaaaaa-0000-0000-0000-000000000003',
    '00000000-0000-0000-0000-000000000002',
    'Preethi Sundaram',
    'preethi.sun@gmail.com',
    '+919900998877',
    'family',
    'March',
    'Four of us, including two teenage kids who spend too much time on their phones. I want a trip that shocks them into looking up.',
    'CONTACTED',
    now() - interval '6 days'
  ),
  (
    'bbbbbbbb-0000-0000-0000-000000000015',
    'aaaaaaaa-0000-0000-0000-000000000003',
    '00000000-0000-0000-0000-000000000003',
    'Farhan Sheikh',
    'farhan.sh@outlook.com',
    '+918822113344',
    'solo',
    'April',
    'I want to go somewhere that makes me feel like I live in a different century for a week. No agenda.',
    'NOT_A_FIT',
    now() - interval '22 days'
  )
on conflict (id) do nothing;

-- Seed Touchpoints (20 notes across leads)
insert into public.touchpoints (id, lead_id, author_id, content, created_at) values
  ('cccccccc-0000-0000-0000-000000000001', 'bbbbbbbb-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000002', 'Called Rohan. He is very clear about what he wants. Solitude, no group pressure, genuinely interested in the monastery visits. Seat confirmed, payment link sent.', now() - interval '14 days'),
  ('cccccccc-0000-0000-0000-000000000002', 'bbbbbbbb-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000002', 'Payment received. Sent him the packing list and accommodation details. He asked about altitude. Shared the acclimatisation notes.', now() - interval '12 days'),
  ('cccccccc-0000-0000-0000-000000000003', 'bbbbbbbb-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000002', 'Spoke to Ananya. Group of 3. One of them has never done a cold weather trip. Talked through what to expect. She sounded genuinely excited.', now() - interval '11 days'),
  ('cccccccc-0000-0000-0000-000000000004', 'bbbbbbbb-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000002', 'Sent vibe check questions. Waiting on response. Third friend (Riya) has a flight from Pune which might make the Jan 18 start tight.', now() - interval '9 days'),
  ('cccccccc-0000-0000-0000-000000000005', 'bbbbbbbb-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000003', 'First call with Siddharth. They are a couple based in Hyderabad. She is more cautious, he is the one who found us. Good fit overall.', now() - interval '9 days'),
  ('cccccccc-0000-0000-0000-000000000006', 'bbbbbbbb-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000003', 'Sent the vibe check form. Siddharth responded same day. His partner Kavya took two days but her answers were thoughtful. They are a good fit.', now() - interval '7 days'),
  ('cccccccc-0000-0000-0000-000000000007', 'bbbbbbbb-0000-0000-0000-000000000005', '00000000-0000-0000-0000-000000000002', 'Spoke to Kabir. Group of 4 photographers. The ask is off-script access to locations and shoot time. That is not what this trip is. Explained that, he was respectful. Not a fit.', now() - interval '19 days'),
  ('cccccccc-0000-0000-0000-000000000008', 'bbbbbbbb-0000-0000-0000-000000000006', '00000000-0000-0000-0000-000000000003', 'WhatsApp message sent. Pooja responded in 2 hours. She and her partner are looking for something without an itinerary. Coorg might be right.', now() - interval '7 days'),
  ('cccccccc-0000-0000-0000-000000000009', 'bbbbbbbb-0000-0000-0000-000000000007', '00000000-0000-0000-0000-000000000003', 'Called Dhruv. His parents are both retired teachers. His dad loves birds. Mentioned the coffee estate has good birding at dawn. He was pleased to hear that.', now() - interval '6 days'),
  ('cccccccc-0000-0000-0000-000000000010', 'bbbbbbbb-0000-0000-0000-000000000007', '00000000-0000-0000-0000-000000000003', 'Sent the trip overview with a note about accessibility since he asked about rough roads. The estate roads are fine. Confirmed this.', now() - interval '5 days'),
  ('cccccccc-0000-0000-0000-000000000011', 'bbbbbbbb-0000-0000-0000-000000000009', '00000000-0000-0000-0000-000000000002', 'Rahul and his friend are good fits. Both from Bangalore, both in the industry. They want to meet people, not just the two of them. That is what Coorg is.', now() - interval '17 days'),
  ('cccccccc-0000-0000-0000-000000000012', 'bbbbbbbb-0000-0000-0000-000000000009', '00000000-0000-0000-0000-000000000002', 'Payment done. Both confirmed. Rahul asked if we could arrange a local coffee guide for one morning. Will check with the estate.', now() - interval '15 days'),
  ('cccccccc-0000-0000-0000-000000000013', 'bbbbbbbb-0000-0000-0000-000000000010', '00000000-0000-0000-0000-000000000003', 'Gentle first message. Nisha seems like she is carrying something heavy. Did not push. Asked open questions. She replied two days later with a long message. Read it carefully.', now() - interval '4 days'),
  ('cccccccc-0000-0000-0000-000000000014', 'bbbbbbbb-0000-0000-0000-000000000011', '00000000-0000-0000-0000-000000000002', 'Aryan and his designer friends are a good fit. They asked specific questions about the artisans, which shows they have done their reading. Sent vibe check.', now() - interval '8 days'),
  ('cccccccc-0000-0000-0000-000000000015', 'bbbbbbbb-0000-0000-0000-000000000011', '00000000-0000-0000-0000-000000000002', 'All three completed the vibe check. Strong answers. Moving to confirm. Waiting on a payment date from Aryan.', now() - interval '6 days'),
  ('cccccccc-0000-0000-0000-000000000016', 'bbbbbbbb-0000-0000-0000-000000000013', '00000000-0000-0000-0000-000000000003', 'Spoke with Vivek. He is solo, mid-30s, works in finance. Very clear about what he wants. Dawn walk on the Rann is the whole reason he is booking. Good fit.', now() - interval '10 days'),
  ('cccccccc-0000-0000-0000-000000000017', 'bbbbbbbb-0000-0000-0000-000000000014', '00000000-0000-0000-0000-000000000002', 'Preethi called us. She has two teenagers who are not thrilled about the trip. I told her that is fine and common. The Rann has a way of cutting through.', now() - interval '5 days'),
  ('cccccccc-0000-0000-0000-000000000018', 'bbbbbbbb-0000-0000-0000-000000000015', '00000000-0000-0000-0000-000000000003', 'Farhan wants to go April, but Kutch in April is too hot and we do not run it then. Explained the season. He was not flexible. Not a fit for this batch.', now() - interval '21 days'),
  ('cccccccc-0000-0000-0000-000000000019', 'bbbbbbbb-0000-0000-0000-000000000004', null, 'Enquiry came in at midnight. Has not replied to the WhatsApp yet. Give it a day.', now() - interval '2 days'),
  ('cccccccc-0000-0000-0000-000000000020', 'bbbbbbbb-0000-0000-0000-000000000008', null, 'Tara enquired this morning. Strong solo traveller profile. Will call tomorrow.', now() - interval '1 day')
on conflict (id) do nothing;

-- Seed Activity Logs
insert into public.activity_logs (lead_id, actor_id, action, metadata, created_at) values
  ('bbbbbbbb-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000002', 'LEAD_CREATED',    '{"source":"enquiry_form"}', now() - interval '15 days'),
  ('bbbbbbbb-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000002', 'STATUS_CHANGED',  '{"from":"NEW","to":"CONTACTED"}', now() - interval '14 days'),
  ('bbbbbbbb-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000002', 'STATUS_CHANGED',  '{"from":"CONTACTED","to":"QUALIFIED"}', now() - interval '13 days'),
  ('bbbbbbbb-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000002', 'STATUS_CHANGED',  '{"from":"QUALIFIED","to":"CONFIRMED"}', now() - interval '12 days'),
  ('bbbbbbbb-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000002', 'LEAD_CREATED',    '{"source":"enquiry_form"}', now() - interval '12 days'),
  ('bbbbbbbb-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000002', 'STATUS_CHANGED',  '{"from":"NEW","to":"CONTACTED"}', now() - interval '11 days'),
  ('bbbbbbbb-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000002', 'STATUS_CHANGED',  '{"from":"CONTACTED","to":"QUALIFIED"}', now() - interval '10 days'),
  ('bbbbbbbb-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000003', 'LEAD_CREATED',    '{"source":"enquiry_form"}', now() - interval '10 days'),
  ('bbbbbbbb-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000003', 'OWNER_ASSIGNED',  '{"owner_name":"Leela Krishnan"}', now() - interval '10 days'),
  ('bbbbbbbb-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000003', 'STATUS_CHANGED',  '{"from":"NEW","to":"CONTACTED"}', now() - interval '9 days'),
  ('bbbbbbbb-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000003', 'STATUS_CHANGED',  '{"from":"CONTACTED","to":"VIBE_CHECK_SENT"}', now() - interval '7 days'),
  ('bbbbbbbb-0000-0000-0000-000000000005', '00000000-0000-0000-0000-000000000002', 'LEAD_CREATED',    '{"source":"enquiry_form"}', now() - interval '20 days'),
  ('bbbbbbbb-0000-0000-0000-000000000005', '00000000-0000-0000-0000-000000000002', 'STATUS_CHANGED',  '{"from":"NEW","to":"NOT_A_FIT"}', now() - interval '19 days'),
  ('bbbbbbbb-0000-0000-0000-000000000009', '00000000-0000-0000-0000-000000000002', 'STATUS_CHANGED',  '{"from":"QUALIFIED","to":"CONFIRMED"}', now() - interval '15 days'),
  ('bbbbbbbb-0000-0000-0000-000000000011', '00000000-0000-0000-0000-000000000002', 'STATUS_CHANGED',  '{"from":"CONTACTED","to":"VIBE_CHECK_SENT"}', now() - interval '6 days');
