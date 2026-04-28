import { SupportPageFrame } from "@/components/layout/SupportPageFrame";

const sizes = [
  { size: "XS", chest: 116, length: 69, shoulder: 55 },
  { size: "S", chest: 120, length: 71, shoulder: 57 },
  { size: "M", chest: 124, length: 73, shoulder: 59 },
  { size: "L", chest: 128, length: 75, shoulder: 61 },
  { size: "XL", chest: 132, length: 77, shoulder: 63 },
];

export default function SizeGuidePage() {
  return (
    <SupportPageFrame title="Size Guide">
      <div className="support-stack">
        <section>
          <h2 className="support-heading">Oversized Tee Measurements</h2>
          <p>
            Use a tee you already own as a reference and compare the measurements below for the closest fit.
          </p>
        </section>

        <div className="overflow-x-auto">
          <table className="size-table">
            <thead>
              <tr>
                <th>Size</th>
                <th>Chest (cm)</th>
                <th>Length (cm)</th>
                <th>Shoulder (cm)</th>
              </tr>
            </thead>
            <tbody>
              {sizes.map((row) => (
                <tr key={row.size}>
                  <td>{row.size}</td>
                  <td>{row.chest}</td>
                  <td>{row.length}</td>
                  <td>{row.shoulder}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </SupportPageFrame>
  );
}
