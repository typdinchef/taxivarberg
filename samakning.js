import React, { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import { supabase } from "./supabaseClient";

export default function SamakningApp() {
  const [drives, setDrives] = useState([]);
  const [newDrive, setNewDrive] = useState({
    name: "",
    location: "",
    week: "",
    time: "",
    seats: 0,
  });

  useEffect(() => {
    fetchDrives();
  }, []);

  const fetchDrives = async () => {
    const { data, error } = await supabase.from("drives").select();
    if (!error) setDrives(data);
  };

  const addDrive = async () => {
    const { data, error } = await supabase.from("drives").insert({
      ...newDrive,
      booked: 0,
    });
    if (!error) {
      fetchDrives();
      setNewDrive({ name: "", location: "", week: "", time: "", seats: 0 });
    }
  };

  const bookSeat = async (id, currentBooked) => {
    const { error } = await supabase
      .from("drives")
      .update({ booked: currentBooked + 1 })
      .eq("id", id);
    if (!error) fetchDrives();
  };

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Samåkning</h1>

      <Card className="mb-6">
        <CardContent className="space-y-2 pt-4">
          <h2 className="text-xl font-semibold">Lägg till en körning</h2>
          <Input
            placeholder="Ditt namn"
            value={newDrive.name}
            onChange={(e) => setNewDrive({ ...newDrive, name: e.target.value })}
          />
          <Input
            placeholder="Plats (t.ex. Uppsala)"
            value={newDrive.location}
            onChange={(e) => setNewDrive({ ...newDrive, location: e.target.value })}
          />
          <Input
            placeholder="Vecka (t.ex. 15)"
            value={newDrive.week}
            onChange={(e) => setNewDrive({ ...newDrive, week: e.target.value })}
          />
          <Input
            placeholder="Tid (t.ex. Mån 08:00)"
            value={newDrive.time}
            onChange={(e) => setNewDrive({ ...newDrive, time: e.target.value })}
          />
          <Input
            type="number"
            placeholder="Antal platser"
            value={newDrive.seats}
            onChange={(e) => setNewDrive({ ...newDrive, seats: parseInt(e.target.value) })}
          />
          <Button onClick={addDrive}>Lägg till</Button>
        </CardContent>
      </Card>

      <h2 className="text-xl font-semibold mb-2">Tillgängliga körningar</h2>
      {drives.map((d) => (
        <Card key={d.id} className="mb-3">
          <CardContent className="pt-4">
            <p><strong>Förare:</strong> {d.name}</p>
            <p><strong>Plats:</strong> {d.location}</p>
            <p><strong>Vecka:</strong> {d.week}</p>
            <p><strong>Tid:</strong> {d.time}</p>
            <p><strong>Platser:</strong> {d.booked}/{d.seats}</p>
            <Button
              disabled={d.booked >= d.seats}
              onClick={() => bookSeat(d.id, d.booked)}
              className="mt-2"
            >
              {d.booked >= d.seats ? "Fullbokad" : "Boka plats"}
            </Button>
          </CardContent>
        </Card>
      ))}

      <div className="mt-6">
        <h2 className="text-xl font-semibold mb-2">Google Kalender (exempel)</h2>
        <iframe
          src="https://calendar.google.com/calendar/embed?src=din-kalender%40gmail.com&ctz=Europe%2FStockholm"
          style={{ border: 0 }}
          width="100%"
          height="600"
          frameBorder="0"
          scrolling="no"
        ></iframe>
      </div>
    </div>
  );
}
