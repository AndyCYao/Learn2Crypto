import json

def reset():
    with open("transactions.json", "w") as transactions:
        json.dump([], transactions)

    with open("customerRef.json", "w") as customerRef:
        json.dump([], customerRef)

    with open("keys.json", "w") as keyFile:
        json.dump({}, keyFile)


if __name__ == "__main__":
    reset()